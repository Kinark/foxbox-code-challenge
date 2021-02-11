import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StatusBar,
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  Easing,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {
  PanGestureHandler,
  State,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'debounce';

import {getCocktails, unsetError, clearDrinks} from '../redux/ducks/cocktails';

import Input from '../components/Input';
import Drink from '../components/Drink';
import EmptyState from '../components/EmptyState';

import Logo from '../images/logo.svg';
import Cocktail from '../images/icons/cocktail.svg';
import SearchIcon from '../images/icons/search.svg';

/* <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}></ScrollView> */

const {height: wHeight} = Dimensions.get('window');
const SLIDE_AMOUNT = wHeight - 225;
const ANIMATION_DURATION = 450;
const EASING = Easing.ease;

const Home = () => {
  const cocktails = useSelector((state) => state.cocktails);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let offset = useRef(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: searchOpen ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true, // <-- Add this
    }).start();
  }, [searchOpen, translateY, fadeAnim]);

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const closeSliderExtra = () => {
    Keyboard.dismiss();
    dispatch(unsetError());
    dispatch(clearDrinks());
    setSearchOpen(false);
    setSearchQuery('');
  };

  const onHandlerStateChanged = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const {translationY} = event.nativeEvent;

      offset.current += translationY;
      console.log(translationY);

      if (translationY <= -100) {
        opened = true;
      } else {
        translateY.setValue(offset.current);
        translateY.setOffset(0);
        offset.current = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? -SLIDE_AMOUNT : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
        easing: EASING,
      }).start(() => {
        setSearchOpen(opened);
        if (!opened) {
          closeSliderExtra();
        } else if (searchInput.current) {
          searchInput.current.focus();
        }
        offset.current = opened ? -SLIDE_AMOUNT : 0;
        translateY.setOffset(offset.current);
        translateY.setValue(0);
      });
    }
  };

  const openSlider = () => {
    Animated.timing(translateY, {
      toValue: -SLIDE_AMOUNT,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      easing: EASING,
    }).start(() => {
      setSearchOpen(true);
      offset.current = -SLIDE_AMOUNT;
      translateY.setOffset(offset.current);
      translateY.setValue(0);
    });
  };

  const closeSlider = () => {
    translateY.setValue(offset.current);
    translateY.setOffset(0);
    Animated.timing(translateY, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      // easing: EASING,
    }).start(() => {
      closeSliderExtra();
      offset.current = 0;
      translateY.setOffset(offset.current);
      translateY.setValue(0);
    });
  };

  const search = useCallback(
    debounce((queryRaw) => {
      const query = queryRaw.trim();
      if (!query) {
        return;
      }
      dispatch(getCocktails(query));
    }, 500),
    [],
  );

  const renderItem = ({item}) => (
    <Drink name={item.strDrink} photo={item.strDrinkThumb} />
  );

  const onSearchInputKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      Keyboard.dismiss();
    }
  };

  useEffect(() => search(searchQuery), [search, searchQuery]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Screen>
        <SmallCocktailWrapper
          style={{
            opacity: translateY.interpolate({
              inputRange: [-SLIDE_AMOUNT, -SLIDE_AMOUNT / 1.25, 0],
              outputRange: [1, 0, 0],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [-SLIDE_AMOUNT, -SLIDE_AMOUNT / 1.25, 0],
                  outputRange: [0, 10, 10],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <Cocktail />
        </SmallCocktailWrapper>
        <Logo />
        <Cocktail style={styles.hidden} />
        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChanged}>
          <SearchPanel
            style={{
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [-SLIDE_AMOUNT, 0],
                    outputRange: [0, SLIDE_AMOUNT],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}>
            <SearchPanelUpperContent>
              <SearchPanelContainer>
                <Input
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  icon={SearchIcon}
                  placeholder="Search your cocktail"
                  onFocus={openSlider}
                  returnKeyType="search"
                  onKeyPress={onSearchInputKeyPress}
                  ref={searchInput}
                  autoCorrect={false}
                />
                <MagicInfo>
                  {cocktails && cocktails.drinks.length
                    ? `${cocktails.drinks.length} drink${
                        cocktails.drinks.length > 1 && 's'
                      } found.`
                    : 'Just type, it searches automagically!'}
                </MagicInfo>
              </SearchPanelContainer>
              {cocktails.loading && (
                <LoaderWrapper>
                  <ActivityIndicator size="small" color="#fff" />
                </LoaderWrapper>
              )}
              {!cocktails.loading && !cocktails.drinks.length && <EmptyState />}
              <DrinksList
                data={cocktails.drinks}
                renderItem={renderItem}
                keyExtractor={(item) => item.idDrink}
              />
            </SearchPanelUpperContent>
            <SearchPanelContainer>
              <Button onPress={closeSlider}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </SearchPanelContainer>
          </SearchPanel>
        </PanGestureHandler>
      </Screen>
    </>
  );
};

export default Home;

const LoaderWrapper = styled.View`
  margin-top: 25px;
`;

const SearchPanelUpperContent = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MagicInfo = styled.Text`
  color: #585858;
  font-size: 14px;
  text-align: center;
`;

const SmallCocktailWrapper = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  padding-left: 7px;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  padding: 12px 24px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  text-align: center;
  font-size: 18px;
`;

const SearchPanel = styled(Animated.View)`
  padding: 16px 0 24px;
  position: absolute;
  background-color: black;
  height: ${wHeight - 110}px;
  width: 100%;
  top: 110px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SearchPanelContainer = styled.View`
  padding: 0 28px;
`;

const DrinksList = styled.FlatList`
  padding: 20px 28px;
  flex: 1;
`;

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});
