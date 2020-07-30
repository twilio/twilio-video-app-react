import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Box, luxColors, Icon, util } from '@alucio/lux-ui';

const styles = StyleSheet.create({
  Content: {
    backgroundColor: luxColors.basicBlack.primary,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageWrapper: {
    bottom: 0,
    height: 50,
    left: '92%',
    position: 'absolute',
    width: 100,
    transform: [
      { rotate: '180deg' },
    ],
  },
  icon: {
    width: 32,
    height: 32,
    color: luxColors.alucioPurple.quinary,
  },
  iconOptionWrapper: {
    alignItems: 'center',
  },
  optionSelectedText: {
    color: luxColors.info.primary,
  },
  optionSelectedBackgroundColor: {
    backgroundColor: luxColors.thumbnailBorder.primary,
  },
  optionSelectedIcon: {
    color: luxColors.info.primary,
  },
  optionText: {
    color: luxColors.alucioPurple.quinary,
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
  isSelected: {
    backgroundColor: luxColors.alucioPurple.quaternary,
  },
  optionsWrapper: {
    width: '100%',
  },
  optionWrapper: {
    paddingTop: 14,
    width: 110,
  },
  sideBarStyle: {
    flexDirection: 'row',
  },
});

export interface MenuOption {
  active?: boolean;
  title: string;
  icon: string;
}

interface SideBarOptionProps {
  menuOption: MenuOption;
  onSelectedOption: (menuOption: MenuOption) => void
}

function SideBarOption(props: SideBarOptionProps): ReactElement<View> {
  function onSelectedOption() {
    props.onSelectedOption(props.menuOption)
  }

  return (
    <View style={util.mergeStyles(undefined, styles.optionWrapper, [styles.optionSelectedBackgroundColor, props.menuOption.active])}>
      <TouchableOpacity onPress={onSelectedOption}>
        <View style={styles.iconOptionWrapper}>
          <View>
            <Icon name={props.menuOption.icon} style={util.mergeStyles(undefined, styles.icon, [styles.optionSelectedIcon, props.menuOption.active])} />
          </View>
          <Text style={util.mergeStyles(undefined, styles.optionText, [styles.optionSelectedText, props.menuOption.active])}>{props.menuOption.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

interface MenuProps {
  menuOptions: MenuOption[],
  onSelectedOption: (menuOption: MenuOption) => void
}

function Menu(props: MenuProps) {
  return (
    <Box style={[styles.optionsWrapper, { flexDirection: 'row' }]}>
      {props.menuOptions.map((menuOption, key) => (
        <SideBarOption key={`sidebaroption_${key}`} menuOption={menuOption} onSelectedOption={props.onSelectedOption} />
      ))}
    </Box>
  )
}

export default Menu
