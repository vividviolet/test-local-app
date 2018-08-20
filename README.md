This is a simple app that consumes the new `ShopifyApp.js`

### Installing as an app on a local shop

This project can be run and installed as an app for testing against `web` by running `dev up && dev server` and visiting: [http://easdk.myshopify.io/auth/shopify?shop=shop1.myshopify.io](http://easdk.myshopify.io/auth/shopify?shop=shop1.myshopify.io) to install it on your local instance of shopify.

Make sure your shop has the `easdkv1` beta flag via [services internal](https://app.myshopify.io/services/internal/). Once you have the beta flagged on your shop, and both web and shopify are running, visit [https://shop1.myshopify.io/admin/apps/easdk](https://shop1.myshopify.io/admin/apps/easdk). Once loaded, click on the Shopify logo at the bottom right-hand corner of your screen and enable internal routes.
