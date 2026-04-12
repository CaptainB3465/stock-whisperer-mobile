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
        data={data}
        width={screenWidth - 60}
        hideDataPoints
        spacing={Math.max((screenWidth - 60) / Math.max(data.length, 1), 2)}
        color={color}
        thickness={2}
        startFillColor={color}
        endFillColor={color}
        startOpacity={0.4}
        endOpacity={0.0}
        initialSpacing={0}
        noOfSections={4}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="transparent"
        yAxisTextStyle={{color: 'gray'}}
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          pointerColor: 'lightgray',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: any) => {
            return (
              <View style={{ height: 90, width: 100, justifyContent: 'center', marginTop: -30 }}>
                <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }}>{'$' + items[0].value.toFixed(2)}</Text>
                </View>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
