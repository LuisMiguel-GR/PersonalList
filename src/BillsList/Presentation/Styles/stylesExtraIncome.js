import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282c34',
      },
      iconButton: {
        padding: 10,
        marginRight: 20
      },
      modalContainer: {
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
        alignItems: 'center',
      },
      flatListContainer: {
        width: '100%',
        maxHeight: 250,
      },
      flatListContent: {
        paddingBottom: 20,
      },
      inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
      },
      inputAmount: {
        padding: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        width: '25%'
      },
      inputDescription: {

        padding: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        width: '55%'
      },
      addButton: {
        backgroundColor: '#5caece',
        padding: 6,
        borderRadius: 50,
      },
      listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6e6a6a',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
      },
      itemText: {
        flex: 1,
        color: '#fff',
      },
      deleteButton: {
        marginLeft: 10,
      },
      closeButton: {
        backgroundColor: '#9e5a5a',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
      },
      title: {
        marginBottom: 15,
        fontSize: 18,
      }
  });