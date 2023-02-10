const sendgrid = require("@sendgrid/mail");

const { SEND_GRID_KEY } = process.env;

function tryCatchWrapper(enpointFn) {
  return async (res, req, next) => {
    try {
      await enpointFn(res, req, next);
    } catch (error) {
      return next(error);
    }
  };
}

async function sendMail({ subject, html }) {
  try {
    console.log("process.env.SEND_GRID_KEY", SEND_GRID_KEY);
    sendgrid.setApiKey(SEND_GRID_KEY);
    const email = {
      from: "malyislava@gmail.com",
      to: "malyislava@gmail.com",
      subject,
      html,
    };
    const response = await sendgrid.send(email);
    console.log(response);
  } catch (error) {
    console.log("App error=>", error);
  }
}

module.exports = {
  tryCatchWrapper,
  sendMail,
};
