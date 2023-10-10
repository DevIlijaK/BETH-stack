import Elysia, { t } from "elysia";
import { todoPlugin } from "./plugins/todoPlugin";
import { BaseHtml } from "./components/baseHTML";
import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRETS as string,
      exp: '1m'
    })
  )
  .use(cookie())

//   .onBeforeHandle(async ({ jwt, set, cookie: { auth } }) => {
//     const profile = await jwt.verify(auth);
//     if (!profile) {
//       set.status = 401;
//       set.redirect = "/login";
//       return "Unauthorized";
//     }
//   })
  .onBeforeHandle(({ set }) => {
    
    console.log("   Ulazi ovde123" + JSON.stringify(set))
    if(set.headers["HX-Request"] == 'true') {
        console.log("   Ulazi ovde")
        set.headers["HX-Location"] = "/sign";
    }else{
        set.redirect = "/login";
    }
  })
  .use(
    todoPlugin({
      prefix: "/todos",
    })
  )
  .get("/sign", async ({ jwt, cookie, setCookie, params }) => {
    setCookie("auth", await jwt.sign(params), {
      httpOnly: true,
    });

    return `Sign in as ${cookie.auth}`;
  })
  .get("/login", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        ></body>
      </BaseHtml>
    )
  )
  .listen(3000);

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
