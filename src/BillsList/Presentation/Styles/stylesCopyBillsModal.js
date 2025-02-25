import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const stylesCopyBillsModal = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.95,
    maxHeight: height * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4a4a4a',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 10,
  },
  monthsListContainer: {
    flexGrow: 1,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  monthButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedMonthButton: {
    backgroundColor: '#87cefa',
    borderColor: '#4682b4',
    borderWidth: 1,
  },
  monthButtonText: {
    fontSize: 16,
    color: '#333',
  },
  expensesListContainer: {
    height: height * 0.45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  expenseName: {
    fontSize: 16,
    color: '#4a4a4a',
    flex: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 10,
    marginRight: 10,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default stylesCopyBillsModal;
