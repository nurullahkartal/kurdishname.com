import { onRequestGet as __api_tracker_ts_onRequestGet } from "C:\\kurdishname\\functions\\api\\tracker.ts"
import { onRequestPost as __api_tracker_ts_onRequestPost } from "C:\\kurdishname\\functions\\api\\tracker.ts"

export const routes = [
    {
      routePath: "/api/tracker",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_tracker_ts_onRequestGet],
    },
  {
      routePath: "/api/tracker",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_tracker_ts_onRequestPost],
    },
  ]