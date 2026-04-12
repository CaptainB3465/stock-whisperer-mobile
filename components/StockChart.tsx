import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface StockChartProps {
  data: { value: number }[];
  isPositive: boolean;
}

export default function StockChart({ data, isPositive }: StockChartProps) {
  if (!data || data.length === 0) return null;

  const color = isPositive ? '#34C759' : '#FF3B30';
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ marginTop: 20 }}>
      <LineChart
        areaChart
        curved
        data={data}
        width={screenWidth - 64}
        height={180}
        hideDataPoints
        spacing={Math.max((screenWidth - 64) / Math.max(data.length - 1, 1), 5)}
        color={color}
        thickness={3}
        startFillColor={color}
        endFillColor={color}
        startOpacity={0.25}
        endOpacity={0.05}
        initialSpacing={0}
        noOfSections={3}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        yAxisTextStyle={{ color: 'rgba(150,150,150,0.6)', fontSize: 10 }}
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: 'rgba(150,150,150,0.3)',
          pointerStripWidth: 1.5,
          pointerColor: color,
          radius: 4,
          pointerLabelWidth: 80,
          pointerLabelHeight: 36,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: any) => {
            return (
              <View style={{ 
                backgroundColor: '#1C1C1E', 
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 8, 
                borderWidth: 1, 
                borderColor: 'rgba(255,255,255,0.1)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
                top: -10
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'white', textAlign: 'center' }}>
                  {'$' + items[0].value.toFixed(2)}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
