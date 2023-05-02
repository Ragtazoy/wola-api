module.exports = ({ env }) => ({
   "vercel-deploy": {
     enabled: true,
     config: {
       deployHook:
         "https://api.vercel.com/v1/integrations/deploy/prj_9gxYisLt5xYJYvCk9edzyheinAxt/yQKIcz0NQx",
       apiToken: "0N9MN9L7rCCr2fsCbEQFT5Xt",
       appFilter: "wola-strapi",
      //  teamFilter: "wola-strapi",
       roles: ["strapi-super-admin", "strapi-editor", "strapi-author", "strapi-employee"],
     },
   },
 });