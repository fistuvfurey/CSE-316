import { Typography, Card, Stack } from '@mui/material';

/*
    This is one of the cards in our expanded accordian details view that
    displays the items of the list.
 */
export default function CommunityListItemsCard(props) {
    const { list } = props;

    let i = 0 // used for mapping the items
    return (
        <Card sx={{flex: 0.62}}>
            <Stack spacing={2}>
                {
                    list.items.map((itemObj) => (
                        i += 1,
                        <Typography variant="h6" padding={1}>{i}. {itemObj.item}</Typography>
                    ))
                }
            </Stack>
        </Card>
    )   
}