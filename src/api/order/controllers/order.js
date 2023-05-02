const stripe = require('stripe')(process.env.STRIPE_KEY);

'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
   async create(ctx) {
      const { selectedProducts, auth } = ctx.request.body

      const lineItems = await Promise.all(
         selectedProducts.map(async (product) => {
            const item = await strapi.service("api::product.product").findOne(product.id)
            return {
               price_data: {
                  currency: "THB",
                  product_data: {
                     name: item.product_name
                  },
                  unit_amount: item.price * 100
               },
               quantity: product.quantity,
            };
         })
      );

      try {
         const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/order?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/order?success=false`,
            line_items: lineItems,
            shipping_address_collection: { allowed_countries: ["TH"] },
            payment_method_types: ["card", "promptpay"],
         })

         await strapi.service("api::order.order").create({
            data: {
               stripe_id: session.id, products: selectedProducts, user_id: auth.user.id
            }
         })

         return { stripeSession: session }
      } catch (err) {
         console.log('catch:', err);
         // ctx.respond.status = 500
         return err
      }
   }
}));
