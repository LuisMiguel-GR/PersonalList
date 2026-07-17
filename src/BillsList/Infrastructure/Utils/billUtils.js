import { collection, getDocs } from 'firebase/firestore';
import db from '../../../Config/firebase';

export const fetchMonthsData = async (user, year) => {
  try {
    const monthsCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months`);
    const monthsSnapshot = await getDocs(monthsCollectionRef);

    if (monthsSnapshot.empty) {
      console.log('No se encontraron documentos de meses para el año:', year);
      return [];
    }

    const monthsData = monthsSnapshot.docs.map(monthDoc => ({
      id: monthDoc.id,
      data: monthDoc.data(),
      bills: [],
      amounts: {}
    }));

    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];

    const currentYear = new Date().getFullYear().toString();
    const currentMonthIndex = new Date().getMonth();

    const orderedMonthsData = monthsData.sort((a, b) => {
      const aIndex = monthNames.indexOf(a.data.name.toLowerCase());
      const bIndex = monthNames.indexOf(b.data.name.toLowerCase());

      if (year === currentYear) {
        const distanceFromCurrent = (index) =>
          index <= currentMonthIndex ? currentMonthIndex - index : index + 12;
        return distanceFromCurrent(aIndex) - distanceFromCurrent(bIndex);
      }

      return bIndex - aIndex;
    });

    return orderedMonthsData;
  } catch (error) {
    console.error('Error al obtener los meses: ', error);
    throw error;
  }
};

export const fetchBillsForMonth = async (monthId, user, year, setMonthsData) => {
  try {
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    monthId = monthNames[monthId];

    const billsCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${monthId}/bills`);
    const billsSnapshot = await getDocs(billsCollectionRef);
    const bills = billsSnapshot.docs.map(billDoc => ({
      id: billDoc.id,
      data: billDoc.data(),
    }));

    const newMonthsData = [...monthsData];
    const monthIndex = newMonthsData.findIndex(month => month.id === monthId);
    newMonthsData[monthIndex].bills = bills;

    setMonthsData(newMonthsData);
  } catch (error) {
    console.error('Error al obtener las facturas del mes: ', error);
    throw error;
  }
};
