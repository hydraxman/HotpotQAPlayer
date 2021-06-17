# run this after: ./gradlew.bat :bootJar
FROM openjdk:8-jdk-alpine
MAINTAINER shbu
ARG JAR_FILE=build/libs/HotpotQAPlayer-1.0-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
COPY pred.json pred.json
#COPY ner.json ner.json
COPY hotpot_dev_distractor_v1.json hotpot_dev_distractor_v1.json

ENV TZ=Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/{TZ} /etc/localtime && echo "{TZ}" > /etc/timezone

EXPOSE 9876

ENTRYPOINT ["java","-jar","/app.jar"]