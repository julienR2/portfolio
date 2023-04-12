import { format, isThisWeek, isToday, isYesterday } from 'date-fns'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

type HeaderProps = {
  date: string
}

const Header = ({ date }: HeaderProps) => {
  const label = React.useMemo(() => {
    const dateObject = new Date(date)

    if (isThisWeek(dateObject, { weekStartsOn: 1 })) {
      if (isToday(dateObject)) {
        return 'Today'
      }

      if (isYesterday(dateObject)) {
        return 'Yesterday'
      }

      return format(dateObject, 'iiii')
    }

    return format(dateObject, 'iii, MMM dd')
  }, [date])

  return (
    <View style={styles.header}>
      <Text variant="titleMedium">{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
})
export default React.memo(Header)
