import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(230, 230, 250, 1)',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: 'gray',
  },
  modalContent: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: '#5caece',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 4,
    fontSize: 16,
  },
  urlsContainer: {
    marginBottom: 20,
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  noUrlsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
  urlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  urlInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  urlInputAmount:{
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginLeft: 3,
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: '#5caece',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButtonUp: {
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'red'
  },
  closeButton: {
    backgroundColor: '#787171',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fieldContainerUrls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 10,
  },
  inputContainerAmount: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  fieldLabelAmount: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 16,
    color: '#5caece',
  },
  fieldInputAmount: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: 100,
  },
  addButtonUrl: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 4,
    marginTop: 20,
  },
  addButtonTextUrl: {
    color: '#fff',
    fontSize: 16,
  },
  closeButtonX: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});
