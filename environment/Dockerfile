FROM node:14-alpine as builder

ARG API_HOST
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG LOCALE

ENV VUE_APP_API_HOST=$API_HOST
ENV VUE_APP_SENTRY_DSN=$SENTRY_DSN
ENV VUE_APP_I18N_LOCALE=$LOCALE
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

ADD /. /code
ADD /.git /code/

WORKDIR /code

RUN apk add --no-cache python make g++ git \
  && npm i -g npm@^7 \
  && npm install --logevel error

# development stage
FROM builder as development

EXPOSE 8080

CMD "/bin/sh -c 'npm install --no-save && npm run serve'"

# production builder stage
FROM builder as builder-production

ENV NODE_ENV=production

RUN npm run build

# production stage
FROM nginx:1.19.4-alpine as production

COPY --from=builder-production /code/environment/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder-production /code/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
