from neo4j import GraphDatabase, basic_auth
import logging
from neo4j.exceptions import ServiceUnavailable
import re

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
            # create new User node in Neo4j
            new_user, status_code = session.write_transaction(
                self._create_user,
                user.name,
                user.email,
                user.pronouns,
                user.birth_month,
                user.description,
                user.top_artists,
                user.top_songs,
                user.refresh_token,
                user.user_id
            )

            for artist in user.top_artists:
                self.top_artist(user.email, artist)

            if status_code != 200:
                return new_user, status_code

            # save optional tidbits, QAs, and pic to newly created user
            return session.write_transaction(
                self._save_facts,
                {**user.tidbits, **user.qas, "pic": user.pic},
                user.email
            )

    @staticmethod
    def _create_user(tx, name, email, pronouns, birth_month, description, top_artists, top_songs, refresh_token, user_id):
        query = (
            '''
            CREATE (new:User {
                name: $name,
                email: $email,
                pronouns: $pronouns,
                birth_month: $birth_month,
                description: $description,
                top_artists: $top_artists,
                top_songs: $top_songs,
                refresh_token: $refresh_token,
                user_id: $user_id
            }) RETURN new
            '''
        )

        results = tx.run(
            query,
            name=re.sub(r"\'",r"\\'", name),
            email=re.sub(r"\'",r"\\'", email),
            pronouns=re.sub(r"\'",r"\\'", pronouns),
            birth_month=birth_month,
            description=re.sub(r"\'",r"\\'", description),
            top_artists=top_artists,
            top_songs=top_songs,
            refresh_token=refresh_token,
            user_id=user_id
        )

        try:
            for record in results:
                return record['new'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            return None, 500

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
    def get_user(self, user_id):
        with self.driver.session() as session:
            return session.read_transaction(self._get_user, user_id)

    @staticmethod
    def _get_user(tx, user_id):
        query = 'MATCH (user:User {user_id: $user_id}) RETURN user'
        results = tx.run(query, user_id=user_id)

        try:
            for record in results:
                return record['user'], 200
            return {}, 404
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            return None, 500

    def top_artist(self, email, artist_name):
        with self.driver.session() as session:
            return session.write_transaction(self._top_artist, email, artist_name)

    @staticmethod
    def _top_artist(tx, email, artist_name):
        query = (
            '''
            MATCH (a:User {email: $email}), (b:Artist {name: $artist_name})
            CREATE (a)-[r:FOLLOWS]->(b)
            '''
        )
        tx.run(query, email=email, artist_name=artist_name)

        return 200

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

    # saves all extra facts (i.e. tidbits and QAs) as properties of User node corresponding to provided email
    def save_facts(self, facts, email):
        with self.driver.session() as session:
            return session.write_transaction(self._save_facts, facts, email)

    @staticmethod
    def _save_facts(tx, facts, email):
        query = ("MATCH (a:User {email: $email})")

        for index, (key, value) in enumerate(facts.items()):
            if index == 0:
                if value is None:
                    query += " SET a.%s = null"%(key) # set to null so Neo4j knows to delete this property from a user's node
                else:
                    query += " SET a.%s = '%s'"%(key, re.sub(r"\'",r"\\'", value))
            else:
                if value is None:
                    query += ", a.%s = null"%(key)
                else:
                    query += ", a.%s = '%s'"%(key, re.sub(r"\'",r"\\'", value))

        query += ' RETURN a'

        result = tx.run(query, email=email)

        try:
            for record in result:
                return record['a'], 200
        except ServiceUnavailable as exception:
            logging.error('{query} raised an error: \n {exception}'.format(query=query, exception=exception))
            return None, 500
