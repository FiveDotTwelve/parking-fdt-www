import { app } from '../../../config/slack';

export const ActionReserve = () => {
  app.view('submit_parking_reservation', async ({ body, ack, client }) => {
    try {
      await ack();

      const formValues = body.view.state.values; // Odczytanie wartości z formularza

      const getValue = (actionId: string) =>
        Object.values(formValues)
          .flatMap((block) => [
            block[actionId]?.selected_option?.value,
            block[actionId]?.selected_date,
          ])
          .find(Boolean);



      console.log(`${getValue('select_parking_spot')} and ${getValue('parking_date')}`);
    } catch (error) {
      console.error(error);
    }
  });
};

// Wzór ---------------------------------

// export const ActionReserve = () => {
//   app.view('submit_parking_reservation', async ({ body, ack, client }) => {
//     try {
//       await ack();

//       const values = body.view.state.values;

//       const getValue = (actionId: string) =>
//         Object.values(values)
//           .map(block => block[actionId]?.selected_option?.value || block[actionId]?.selected_date)
//           .find(Boolean);

//       const parkingSpot = getValue('select_parking_spot');
//       const reservationDate = getValue('parking_date');

//       console.log('Wybrany parking:', parkingSpot);
//       console.log('Data rezerwacji:', reservationDate);

//       // Potwierdzenie dla użytkownika
//       await client.chat.postMessage({
//         channel: body.user.id,
//         text: `Twoja rezerwacja: ${parkingSpot} na ${reservationDate} została zapisana ✅`,
//       });
//     } catch (error) {
//       console.error('Błąd w ActionReserve:', error);

//       try {
//         await client.chat.postMessage({
//           channel: body.user.id,
//           text: 'Wystąpił błąd podczas zapisywania rezerwacji. Spróbuj ponownie.',
//         });
//       } catch (postError) {
//         console.error('Nie udało się wysłać wiadomości o błędzie:', postError);
//       }
//     }
//   });
// };
