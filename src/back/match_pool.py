from neo4j import GraphDatabase, basic_auth
import logging
from neo4j.exceptions import ServiceUnavailable

class MatchPool:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=basic_auth(user, password))

    def close(self):
        self.driver.close()

    def create_artist(self, artist):
        print(artist.name)
        with self.driver.session() as session:
            return session.write_transaction(
                self._create_artist,
                artist.name
            )

    @staticmethod
    def _create_artist(tx, name):
        print(name)
        query = (
            '''
            CREATE (new:Artist {
                name: $name
            }) RETURN new
            '''
        )
        results = tx.run(query, name=name)

        try:
            for record in results:
                return record['new'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # create user
    def create_user(self, user):
        with self.driver.session() as session:
            return session.write_transaction(
                self._create_user,
                user.name,
                user.email,
                user.top_artists,
                user.top_songs
            )

    @staticmethod
    def _create_user(tx, name, email, top_artists, top_songs):
        query = (
            '''
            CREATE (new:User {
                name: $name,
                email: $email,
                top_artists: $top_artists,
                top_songs: $top_songs
            }) RETURN new
            '''
        )
        results = tx.run(query, name=name, email=email, top_artists=top_artists, top_songs=top_songs)

        try:
            for record in results:
                return record['new'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # delete user
    def delete_user(self, email):
        with self.driver.session() as session:
            return session.write_transaction(self._delete_user, email)

    @staticmethod
    def _delete_user(tx, email):
        query = 'MATCH (user:User {email: $email}) DETACH DELETE user RETURN user'
        results = tx.run(query, email=email)

        try:
            for record in results:
                return record['user'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # set 'DISLIKES' relationship on node A -> node B
    def dislike(self, email_a, email_b):
        with self.driver.session() as session:
            return session.write_transaction(self._dislike, email_a, email_b)

    @staticmethod
    def _dislike(tx, email_a, email_b):
        query = (
            '''
            MATCH (a:User {email: $email_a}), (b:User {email: $email_b})
            CREATE (a)-[r:DISLIKES]->(b)
            '''
        )
        tx.run(query, email_a=email_a, email_b=email_b)

        return 200

    # get matched list
    def get_matched(self, email):
        with self.driver.session() as session:
            result = session.read_transaction(self._get_matched, email)
            return result

    @staticmethod
    def _get_matched(tx, email):
        query = (
            '''
            MATCH (a:User {email: $email})
            WITH a
            MATCH (b: User)
            WHERE exists((a)-[:LIKES]->(b)) AND exists((a)<-[:LIKES]-(b))
            RETURN b
            '''
        )
        results = tx.run(query, email=email)

        try:
            unmetList = [record['b'] for record in results]
            return unmetList, 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # get unmet list
    def get_unmet(self, email):
        with self.driver.session() as session:
            result = session.read_transaction(self._get_unmet, email)
            return result

    @staticmethod
    def _get_unmet(tx, email):
        query = (
            '''
            MATCH (thisUser:User {email: $email})
            WITH thisUser
            MATCH (otherUser:User)
            WHERE NOT exists((thisUser)-[]->(otherUser)) AND thisUser <> otherUser
            RETURN otherUser
            LIMIT 10
            '''
        )
        results = tx.run(query, email=email)

        try:
            unmetList = [record['otherUser'] for record in results]
            return unmetList, 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # get user
    def get_user(self, email):
        with self.driver.session() as session:
            return session.read_transaction(self._get_user, email)

    @staticmethod
    def _get_user(tx, email):
        query = 'MATCH (user:User {email: $email}) RETURN user'
        results = tx.run(query, email=email)

        try:
            for record in results:
                return record['user'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            raise

    # set 'LIKES' relationship on node A -> node B
    def like(self, email_a, email_b):
        with self.driver.session() as session:
            return session.write_transaction(self._like, email_a, email_b)

    @staticmethod
    def _like(tx, email_a, email_b):
        query = (
            '''
            MATCH (a:User {email: $email_a}), (b:User {email: $email_b})
            CREATE (a)-[r:LIKES]->(b)
            '''
        )
        tx.run(query, email_a=email_a, email_b=email_b)

        return 200
