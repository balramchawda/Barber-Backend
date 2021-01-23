/* eslint-disable no-console */
import FCM from "fcm-node"
import _ from "lodash"
import apn from "apn"
import fs, { unwatchFile } from "fs"
import path from "path"

const serverKey = require("./privateKey.json")
const fcmProvider = new FCM(serverKey)

module.exports.pushnotification = function(title, msg,deviceType, receiver_token,type = '10001',badge=0) {
    if (receiver_token !== "" && msg !== "") {
      try {
        if (deviceType === "ios") {
            // console.log('token',receiver_token);
          const options = {
            token: {
              key: fs.readFileSync(
                path.resolve("src/firebase/Trim_App_AuthKey_Key_XBAXLUNV8Z_team_5ZG7NY3C7C.p8")
              ),
              keyId: "XBAXLUNV8Z",
              teamId: "5ZG7NY3C7C"
            },
            production: false
          }
          // console.log(to)
          const apnProvider = new apn.Provider(options)
          const note = new apn.Notification()
          // Expires 1 hour from now.
          note.expiry = Math.floor(Date.now() / 1000) + 3600
          note.badge = 1
          note.sound = "ping.aiff"
          note.alert = msg
          note.payload = { title: title, body: msg }
          note.topic = "com.vogueme.trim"
          apnProvider.send(note, receiver_token).then(result => {
            console.log(result)
          }).catch(err=>{
            console.log(err);
          })
        }
        // Device type is Android then send notification with firebase file details
        if (deviceType === "android") {
          try {
            var message = {
              to: receiver_token,
              notification: { title: title, body: msg ,type:type}
            }
            console.log(message);
            fcmProvider.send(message, (err, response) => {
              if (err) console.log({ err })
              console.log("ssss",response )
            })
          } catch (error) {
            console.log({ error })
          }          
        }
      } catch (error) {
        console.log({ error })
      }
    }
}
