FROM openjdk:8-jdk-alpine
ENV MONGODB_URI mongodb://18.144.22.172:20087/db
ENV MONGODB_STATUS_HOST=18.144.22.172
ENV MONGODB_STATUS_PORT=20087
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
