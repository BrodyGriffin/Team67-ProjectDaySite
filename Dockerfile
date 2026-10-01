# TraceStock Projects Day site: static site served by nginx.
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="TraceStock Projects Day site" \
      org.opencontainers.image.description="Showcase website for TraceStock by Team Nexus (Team 67), University of Johannesburg" \
      org.opencontainers.image.vendor="Team Nexus"

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
