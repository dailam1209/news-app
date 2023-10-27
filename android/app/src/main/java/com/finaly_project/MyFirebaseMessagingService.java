// package com.finaly_project;

// import com.google.firebase.messaging.FirebaseMessagingService;
// import com.google.firebase.messaging.RemoteMessage;

// public class MyFirebaseMessagingService extends FirebaseMessagingService {

//     private static final String NOTIFICATION_ID = "Notification_id"
//     NotificationManagerCompat managerCompat;
//     @Override
//     public void onMessageReceived(RemoteMessage remoteMessage) {
//         super.onMessageReceived( remoteMessage );
//         if(remoteMessage.getNotification() !== null) {
//             String title = remoteMessage.getNotification().getTitle();
//             String body = remoteMessage.getNotification().getBody();
//             managerCompat = NotificationManagerCompat.from( this );
//             showNotification( title, body);
//         }
//     }

//     private void showNotification( String title, String body) {
//         Notification notification = new Notification.Builder(MyFirebaseMessagingService.this, NOTIFICATION_ID )
//             .setContentTitle( title )
//                 .setContentText( body )
//                 .setPriority( NotificationCompat.PRIORITY_HIGH )
//                 .setCategory( No)
//     }
// }