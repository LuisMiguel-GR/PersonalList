import { StyleSheet } from 'react-native';

const stylesBillsList = StyleSheet.create({
  
    cardContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  billListContainer: {
    height: 300,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default stylesBillsList;
