import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  cardContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 0,
    borderRadius: 10,
    width: '90%',
    paddingHorizontal: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  yearText: {
    fontSize: 16,
    marginRight: 5,
  },
  plusIconContainer: {
    backgroundColor: '#5caece',
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
});
