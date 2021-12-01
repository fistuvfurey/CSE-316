import { styled } from '@mui/material/styles';

const Description = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    padding: theme.spacing(1),
  }));

const SmallText = styled('div')(({ theme }) => ( {
    ...theme.typography.caption,
    padding: theme.spacing(1),
}));

export default function SplashScreen() {
    return (
        <div id="splash-screen">
            The Top 5<br />
            Lister
            <Description>{"A community-based social media app centered around sharing Top 5 Lists!"}</Description>
            <SmallText>{"Created by Aidan Furey, CSE 316, Fall 2021, Stony Brook University"}</SmallText>
        </div>
    )
}