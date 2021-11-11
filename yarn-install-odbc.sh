#!/usr/bin/env zsh
CELLAR_ODBC=`brew info unixodbc | grep Cellar | awk '{print $1}'`
LIB_ODBC=$CELLAR_ODBC/lib 
SRC_ODBC=$CELLAR_ODBC/include
export C_INCLUDE_PATH=$C_INCLUDE_PATH:$SRC_ODBC
export CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:$SRC_ODBC
export LIBRARY_PATH=$LIBRARY_PATH:$LIB_ODBC
yarn install
