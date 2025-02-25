import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        paddingHorizontal: 20,
      },
      title: {
        fontSize: 25,
      },
      label: {
        fontSize: 14,
        marginTop: 10,
      },
      input: {
        width: '100%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: '#5caece',
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
      },
      cancelButton: {
        backgroundColor: '#d9534f',
        width: '48%',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      },
      addButton: {
        backgroundColor: '#5caece',
        width: '48%',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
});
