import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  yearSelectorContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  yearScrollContent: {
    paddingHorizontal: 15,
  },
  yearButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  yearButtonActive: {
    backgroundColor: '#5caece',
  },
  yearButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  yearButtonActiveText: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    margin: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5caece',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  },
  yearScrollContent: {
    paddingHorizontal: 15,
    alignItems: 'center', // Optional for vertical centering
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10, // Espacio entre título e importe
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5caece',
    alignSelf: 'flex-end', // Alinea a la derecha
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
    marginLeft: 34, // Alineado con el icono del coche
    paddingRight: 10, // Para que no quede pegado al borde
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cardDescription: {
  fontSize: 14,
  color: '#7f8c8d',
  marginBottom: 10,
  paddingLeft: 34, // Para alinear con el icono
},
cardFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: 5,
},
cardKms: {
  fontSize: 12,
  color: '#95a5a6',
  fontStyle: 'italic',
},
cardDate: {
  fontSize: 12,
  color: '#95a5a6',
},
  cardTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cardDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 3,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5caece',
    fontWeight: 'bold',
    color: '#5caece',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    paddingLeft: 34,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    color: '#95a5a6',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#5caece',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});