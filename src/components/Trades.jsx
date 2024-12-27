import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import useTrading from '../hooks/useTrading.mjs';
import useEnergyStorage from '../hooks/useEnergyStorage.mjs';
import { TradeCard } from './TradeCard';

export const Trades = () => {
  const { tradingContract } = useTrading();
  const { energyStorageContract } = useEnergyStorage();
  const { gridData } = useContext(UserContext);
  const [trades, setTrades] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await tradingContract.getActiveTrades(gridData.gridId);

        // Parse proxy result array
        const formattedTrades = response.map((trade) => ({
          gridId: trade.gridId,
          kWh: trade.kWh.toString(),
          pricePerKWh: trade.pricePerkWh.toString(),
          tradeId: trade.tradeId,
          seller: trade.seller,
          isActive: trade.isActive,
          sourceTypeIds: trade.sourceTypeIds.map((id) => id.toString()),
        }));

        console.log('trades', formattedTrades);
        setTrades(formattedTrades);
      } catch (error) {
        console.log('Unable to fetch trades', error);
      }
    };
    fetchTrades();
  }, [gridData]);

  return (
    <div className="trades-grid">
      {trades?.map((trade, index) => (
        <TradeCard data={trade} key={index} />
      ))}
    </div>
  );
};
