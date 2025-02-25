import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
  },
  containerCarBill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginBottom: 0
  },
  textCarBill: {
    fontFamily: 'Pacifico',
    fontSize: 16,
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0,
    color: '#333',
  },
  detailsContainer: {
    padding: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  kmsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  descriptionText: {
    color: '#5caece',
    fontFamily: 'Pacifico',
    fontSize: 14,
    marginBottom: 4,
  },
  kmsText: {
    fontFamily: 'Pacifico',
    fontSize: 14,
    color: '#666',
  },
  amountText: {
    fontFamily: 'Pacifico',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5caece',
    marginRight: 8,
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  expandButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#333',
    marginBottom: 10,
    fontSize: 16,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  addButton: {
    backgroundColor: '#5caece',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
  },
  checkboxContainer: {
    marginLeft: 0,
    paddingLeft: 0,
    marginRight: 0,
    paddingRight: 5,
  },
  titleText:{
    fontFamily: 'Pacifico',
  },
  kmsTextVar: {
    fontFamily: 'Pacifico',
    color: '#5caece',
    fontSize: 18,
  }
});
