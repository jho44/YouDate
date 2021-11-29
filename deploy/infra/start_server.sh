#!/bin/bash
PID=$(ps aux | grep 'uvicorn main:app' | grep -v grep | awk {'print $2'} | xargs)
if [ "$PID" != "" ]
then
kill -9 $PID
echo "-----NEW RUN-----" > nohup.out
else
echo "Starting FastAPI server"
fi
nohup uvicorn main:app --host 0.0.0.0 --posrt 8000 &