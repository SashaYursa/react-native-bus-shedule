import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FlatList, ScrollView, Animated, StyleSheet, View, Button } from 'react-native'
import SearchField from './SearchField'
import styled from 'styled-components/native'
import { FlashList } from '@shopify/flash-list'

type Props = {
    itemsForSearch: string[]
    title: string
    setSearchedVale: (value: string) => void
}

const SearchFieldWithDropdown = ({itemsForSearch, title, setSearchedVale}: Props) => {
    console.log('rerender')
    const [searchItem, setSearchItem] = useState<{value: string | undefined, type: 'input' | undefined}>({value: undefined, type: undefined})
    const [valuesForSearchList, setValuesForSearchList] = useState<string[]>([])
    const [expanded, setExpanded] = useState(false)
    const [canShowList, setCanShowList] = useState(false)
    const animHeightRef = useRef(new Animated.Value(0)).current
    const opacityValue = animHeightRef.interpolate({ 
        inputRange: [10, 200], 
        outputRange: [0, 1]
    });
    
    useEffect(() => {
        if(searchItem.type === 'input' && typeof searchItem.value  === 'string'){
            const searchedValue = searchItem.value.toUpperCase()
            setValuesForSearchList(itemsForSearch.filter(item => item.toUpperCase().includes(searchedValue)))
            if(searchItem.value.length > 0){
                setExpanded(true)
            }
            else{
                setExpanded(false)
            }
        }
        else if(typeof searchItem.value === 'string'){
            setSearchedVale(searchItem.value)
            setExpanded(false)
        }
    }, [searchItem])
    useEffect(() => {
        if(expanded){
            Animated.timing(animHeightRef, {
                toValue: 210,
                duration: 200,
                useNativeDriver: false
            }).start(() => setCanShowList(true))
        }else{
            Animated.timing(animHeightRef, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start(() => setCanShowList(false))
        }
    }, [expanded])
    useLayoutEffect(() => {
        
    }, [expanded])
  return (
    <Animated.View style={[{position: 'relative', paddingBottom: animHeightRef}]}>
        <SearchField enabled={true} 
        itemsForSearch={itemsForSearch.map(item => ({title: item, value: item}))} 
        selectedValue={searchItem.value} 
        setSelectedValue={(value, type) => setSearchItem({value, type})} 
        title={title}
        />
        <Animated.View style={[style.expandView, {opacity: opacityValue, minHeight: animHeightRef}]}>
            { (valuesForSearchList.length > 0 && searchItem.type && canShowList) && 
                <FlashList showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 5}}
                estimatedItemSize={30}
                data={valuesForSearchList}
                renderItem={({item}) => <SearchedValueButton onPress={() => {setSearchedVale(item)}}>
                        <SearchedValueText>
                            {item}
                        </SearchedValueText>
                    </SearchedValueButton>
                }
                />
            }
            </Animated.View>
    </Animated.View>
    
  )
}

const style = StyleSheet.create({
    expandView: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        height: 200,
        top: 5,
        width: '100%',
        borderStartColor: '#7e197eaaea',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    }
})

const SearchedValueButton = styled.TouchableOpacity`
    background-color: #43b043;
    padding: 10px 5px;
    border-radius: 12px;
    margin-bottom: 5px;
`

const SearchedValueText = styled.Text`
    font-size: 14px;
    color: #fff
`
export default SearchFieldWithDropdown;