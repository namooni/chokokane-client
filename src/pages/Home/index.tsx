import styled from 'styled-components';
import { FlexBox, Text } from '../../components';
import { colors } from '../../theme/palette';
import Card from '../../components/Card';

const HomePage = () => {
  return (
    <HomeContainer>
      <DateSelector>
        {'<'} 2026年10月 {'>'}
      </DateSelector>
      <BudgetInfoCard background={colors.budgetCard}>
        <BudgetTitle color={colors.textSoft} variant="small">
          今月あと使えるお金
        </BudgetTitle>
        <RemainBudget
          color={colors.budgetCardText}
          variant="display"
          weight={700}
        >
          ¥61,580
        </RemainBudget>
        <RemainBar />
        <BudgetInfoWrap>
          <BudgetInfoItem>
            <BudgetSubText>使った</BudgetSubText>
            <BudgetAmountInfoText>¥38,420</BudgetAmountInfoText>
          </BudgetInfoItem>
          <BudgetInfoItem>
            <BudgetSubText align="flex-end">今月の予算</BudgetSubText>
            <BudgetAmountInfoText>¥100,000</BudgetAmountInfoText>
          </BudgetInfoItem>
        </BudgetInfoWrap>
      </BudgetInfoCard>

      <SubInfoCardWrap>
        <SubInfoCard>
          <SubInfoCardTitle>1日使える</SubInfoCardTitle>
          <SubInfoAmountText>¥2,565</SubInfoAmountText>
          <SubInfoSubtitle>今日から月末まで</SubInfoSubtitle>
        </SubInfoCard>
        <SubInfoCard>
          <SubInfoCardTitle>今月の支出</SubInfoCardTitle>
          <SubInfoAmountText>¥2,180</SubInfoAmountText>
          <SubInfoSubtitle>目安より ¥385 少ない</SubInfoSubtitle>
        </SubInfoCard>
      </SubInfoCardWrap>

      <PaceCard>
        <PaceText>✳ いいペースです！</PaceText>
        <PaceSubText>今のペースなら予算内に収まりそうです。</PaceSubText>
      </PaceCard>

      <RecentWrap>
        <RecentHeader>
          <RecentTitle>最近の支出</RecentTitle>
          <RecetMore>すべて見る {'->'}</RecetMore>
        </RecentHeader>

        <RecentItem>
          <RecentCategoryCard />
          <RecentTextWrap>
            <RecentItemTitle>コンビニ</RecentItemTitle>
            <RecentItemSubtitle>食費 · 10/7</RecentItemSubtitle>
          </RecentTextWrap>
          <RecentAmount>−¥430</RecentAmount>
        </RecentItem>
        <RecentItem>
          <RecentCategoryCard />
          <RecentTextWrap>
            <RecentItemTitle>コンビニ</RecentItemTitle>
            <RecentItemSubtitle>食費 · 10/7</RecentItemSubtitle>
          </RecentTextWrap>
          <RecentAmount>−¥430</RecentAmount>
        </RecentItem>
        <RecentItem>
          <RecentCategoryCard />
          <RecentTextWrap>
            <RecentItemTitle>コンビニ</RecentItemTitle>
            <RecentItemSubtitle>食費 · 10/7</RecentItemSubtitle>
          </RecentTextWrap>
          <RecentAmount>−¥430</RecentAmount>
        </RecentItem>
        <RecentItem>
          <RecentCategoryCard />
          <RecentTextWrap>
            <RecentItemTitle>コンビニ</RecentItemTitle>
            <RecentItemSubtitle>食費 · 10/7</RecentItemSubtitle>
          </RecentTextWrap>
          <RecentAmount>−¥430</RecentAmount>
        </RecentItem>
      </RecentWrap>
    </HomeContainer>
  );
};

const HomeContainer = styled(FlexBox)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DateSelector = styled.div`
  text-align: center;
  margin: 10px 0;
`;

const BudgetInfoCard = styled(Card)``;

const BudgetTitle = styled(Text)``;

const RemainBudget = styled(Text)``;

const RemainBar = styled.div`
  height: 9px;
  background-color: ${colors.budgetCardAccent};
  border-radius: 16px;
  margin: 16px 0;
`;

const BudgetInfoWrap = styled(FlexBox)`
  display: flex;
  justify-content: space-between;
`;

const BudgetInfoItem = styled.div``;

const BudgetSubText = styled(Text).attrs({
  color: colors.textSoft,
  variant: 'caption',
})<{
  align?: string;
}>`
  display: flex;
  justify-content: ${({ align }) => align ?? align};
`;

const BudgetAmountInfoText = styled(Text).attrs({
  color: colors.budgetCardText,
  variant: 'body',
  weight: 700,
})``;

const SubInfoCardWrap = styled(FlexBox)`
  display: flex;
  gap: 10px;
`;

const SubInfoCard = styled(Card).attrs({
  border: `1px solid ${colors.borderSubtle}`,
})``;

const SubInfoCardTitle = styled(Text).attrs({
  tone: 'muted',
  variant: 'caption',
})``;

const SubInfoAmountText = styled(Text).attrs({
  variant: 'title',
})`
  margin: 4px 0 10px;
`;

const SubInfoSubtitle = styled(Text).attrs({
  color: colors.primary,
  variant: 'caption',
})``;

const PaceCard = styled(Card).attrs({
  background: colors.primarySoft,
  gap: 6,
})``;

const PaceText = styled(Text).attrs({
  tone: 'accent',
  weight: 700,
})``;

const PaceSubText = styled(Text).attrs({
  variant: 'small',
  color: colors.primary,
})``;

const RecentWrap = styled(FlexBox).attrs({
  direction: 'column',
  gap: 16,
})``;

const RecentHeader = styled(FlexBox).attrs({
  justify: 'space-between',
})`
  flex: 1;
  align-items: center;
`;

const RecentTitle = styled(Text).attrs({
  weight: 700,
  variant: 'body',
})`
  padding: 0 4px;
`;

const RecetMore = styled(Text).attrs({
  tone: 'accent',
  variant: 'caption',
})``;

const RecentItem = styled(FlexBox).attrs({
  align: 'center',
})``;

const RecentCategoryCard = styled.div`
  width: 36px;
  height: 36px;
  background-color: ${colors.categoryFood};
  opacity: 0.2;
  border-radius: 10px;
`;

const RecentTextWrap = styled(FlexBox).attrs({
  direction: 'column',
})`
  margin-left: 8px;
`;

const RecentItemTitle = styled(Text).attrs({
  weight: 700,
  variant: 'small',
})``;

const RecentItemSubtitle = styled(Text).attrs({
  variant: 'caption',
})``;

const RecentAmount = styled(Text).attrs({
  weight: 700,
  variant: 'small',
})`
  margin-left: auto;
`;

export default HomePage;
