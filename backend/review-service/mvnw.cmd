@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to enable pausing at the end of the script
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM     set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to skip loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
@REM set title of command prompt window
title %0
@REM enable echoing by setting MAVEN_BATCH_ECHO to 'on'
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%USERPROFILE%")

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%" == "yes" (
  if exist "%PROGRAMDATA%\mavenrc.cmd" call "%PROGRAMDATA%\mavenrc.cmd"
  if exist "%USERPROFILE%\mavenrc.cmd" call "%USERPROFILE%\mavenrc.cmd"
)

@setlocal

set ERROR_CODE=0

@REM To find Directory where this script exists
set "MAVEN_PROJECTBASEDIR=%~dp0"
if not "%MAVEN_PROJECTBASEDIR:~-1%" == "\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

@REM Find the project base dir, i.e. physical directory where this script sits
set "PROJECT_BASE_DIR=%MAVEN_PROJECTBASEDIR%"

@REM Find the java.exe to use
if not "%JAVA_HOME%" == "" (
  set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) else (
  set "JAVA_EXE=java.exe"
)

if not exist "%JAVA_EXE%" (
  echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
  echo Please set the JAVA_HOME variable in your Environment to match the
  echo location of your Java installation.
  goto error
)

@REM Extension to allow passing parameters to maven-wrapper.jar
set WRAPPER_LAUNCHER_ARGS=
:argsLoop
if "%~1" == "" goto argsEnd
set "WRAPPER_LAUNCHER_ARGS=%WRAPPER_LAUNCHER_ARGS% %1"
shift
goto argsLoop
:argsEnd

set "BASE_DIR=%MAVEN_PROJECTBASEDIR:~0,-1%"
"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%BASE_DIR%" %WRAPPER_LAUNCHER% %WRAPPER_LAUNCHER_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
if not "%MAVEN_BATCH_PAUSE%" == "on" goto skipPause
:pause
pause
:skipPause
exit /b %ERROR_CODE%
