import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import stylesBillsList from '../Presentation/Styles/stylesBillsList';
import ListBill from './Bill';

const MonthCard = ({ month, isExpanded, toggleExpandMonth, fetchBillsForMonth, monthsData, handlePaidChange, handleBillDeleted, handleBillAddedOrUpdated, year, sortBills }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const amounts = month.amounts || {};

  const getTotalAmountStyle = () => ({
    color: amounts.totalAmount < 0 ? 'red' : 'green',
  });

  const getOutstandingBalanceStyle = () => ({
    color: amounts.totalUnpaidAmount < 0 ? 'red' : 'green',
  });

  const getAmountPaidStyle = () => ({
    color: amounts.totalPaidAmount < 0 ? 'red' : 'green',
  });

  const getAmountRemainingStyle = () => ({
    color: amounts.remaining < 0 ? 'red' : 'green',
  });

  return (
    <TouchableOpacity
      key={month.id}
      onPress={() => {
        if (!isExpanded) {
          fetchBillsForMonth(month.id, monthsData);
        }
        toggleExpandMonth(month.id);
      }}
      style={[stylesBillsList.cardContainer, { height: isExpanded ? 400 : 50 }]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={stylesBillsList.cardTitle}>{month.data.name}</Text>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <IconButton icon="plus" color="#000" size={20} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => { sortBills('noPaid'); closeMenu(); }} title="Ordenar por no pagado" />
          <Menu.Item onPress={() => { sortBills('paid'); closeMenu(); }} title="Ordenar por pagado" />
          <Menu.Item onPress={() => { sortBills('highestAmount'); closeMenu(); }} title="Ordenar por mayor importe" />
          <Menu.Item onPress={() => { sortBills('lowestAmount'); closeMenu(); }} title="Ordenar por menor importe" />
          <Menu.Item onPress={() => { sortBills('creation'); closeMenu(); }} title="Ordenar por creación" />
          <Menu.Item onPress={() => { sortBills('alphabeticalAsc'); closeMenu(); }} title="Ordenar alfabéticamente (A-Z)" />
          <Menu.Item onPress={() => { sortBills('alphabeticalDesc'); closeMenu(); }} title="Ordenar alfabéticamente (Z-A)" />
        </Menu>
      </View>
      {isExpanded && (
        <View style={stylesBillsList.flatListContainer}>
          <View style={stylesBillsList.containerText}>
            <Text style={stylesBillsList.text}>Total: <Text style={getTotalAmountStyle()}>{amounts.totalAmount}€</Text></Text>
            <Text style={stylesBillsList.text}>Restante: <Text style={getAmountRemainingStyle()}>{amounts.remaining}€</Text></Text>
            <Text style={stylesBillsList.text}>Sin pagar: <Text style={getOutstandingBalanceStyle()}>{amounts.totalUnpaidAmount}€</Text></Text>
            <Text style={stylesBillsList.text}>Pagado: <Text style={getAmountPaidStyle()}>{amounts.totalPaidAmount}€</Text></Text>
          </View>
          <View style={stylesBillsList.separatorLine} />
          <ScrollView>
            <FlatList
              data={month.bills}
              renderItem={({ item }) => (
                <ListBill
                  bill={item}
                  onPaidChange={() => handlePaidChange(month.id)}
                  onBillDeleted={() => handleBillDeleted(month.id)}
                  onBillUpdated={() => handleBillAddedOrUpdated(month.id)}
                />
              )}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text style={stylesBillsList.emptyText}>No hay gastos para este mes</Text>}
            />
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MonthCard;
