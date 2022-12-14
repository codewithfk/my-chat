import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: "f36f4190-1428-4552-bfa6-9dad3b0d8143",
    allowLocalhostAsSecureOrigin: true,
  });
  OneSignal.showSlidedownPrompt();
  OneSignal.on("subscriptionChange", function (isSubscribed) {
    console.log("The user's subscription state is now:", isSubscribed);
  });
}
// import OneSignal from "react-onesignal";

// //Example2
// const [initialized, setInitialized] = useState(false);
// OneSignal.init({ appId: "f36f4190-1428-4552-bfa6-9dad3b0d8143" }).then(
//   (res) => {
//     console.log({ res });
//     setInitialized(true);
//     OneSignal.showSlidedownPrompt().then((result) => {
//       console.log({ result });
//     });
//   }
// );
// function onesignal() {
//   return <div>onesignal</div>;
// }

// export default onesignal;
