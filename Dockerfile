FROM node:16
WORKDIR /app
# . will refer to the WORKDIR in the container, in this case will refer the /app
COPY package.json .
# RUN is an image build step, the state of the container after a RUN command will be committed to the container image
# RUN npm install

# access the build arg NODE_ENV
ARG NODE_ENV
# conditional statement script
# spaces in this if is IMPORTANT!!!!!!!!!!!
RUN if [ "${NODE_ENV}" = "development" ]; \
  then npm install; \
  else npm install --only=production; \
  fi

COPY . .
ENV PORT=3000
EXPOSE ${PORT}
# CMD is the command the container executes by default when you launch the built image. A Dockerfile will only use the final CMD defined.
CMD [ "node", "app.js" ]