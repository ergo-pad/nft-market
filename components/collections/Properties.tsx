import React, { FC } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  useTheme
} from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface ICollectionTraits {
  traitName: string;
  id: string;
  description: string;
  type: 'Property' | 'Level' | 'Stat',
  max?: number;
  options?: {
    property: string;
    amount: number;
  }[]
}

export interface ICollectionRarities {
  rarity: string;
  amount: number;
}

interface IPropertiesProps {
  traits: ICollectionTraits[];
  rarities: ICollectionRarities[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // '&:not(:last-child)': {
  //   borderBottom: 0,
  // },
  // background: 'none',
  borderRadius: '6px',
  '&:before': {
    display: 'none',
  },
  marginBottom: '8px',
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon />}
    {...props}
  />
))(({ theme }) => ({
  background: 'none',
  // '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
  //   transform: 'rotate(90deg)',
  // },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  paddingLeft: '24px',
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Properties: FC<IPropertiesProps> = ({ traits, rarities }) => {
  const theme = useTheme()
  return (
    <>
      {rarities.length > 0 && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Rarities</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {rarities.map((item, i) => {
                return (
                  <ListItem key={i}>
                    <ListItemText>
                      {item.rarity + ' (' + item.amount + ')'}
                    </ListItemText>
                  </ListItem>
                )
              })}

            </List>
          </AccordionDetails>
        </Accordion>
      )}
      {traits.map((item, i) => {
        return (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={item.traitName + '-content'}
              id={item.traitName + '-header'}
            >
              <Typography variant="h6">{item.traitName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {item.description && (
                  <ListItem>
                    <ListItemText>
                      <Typography component="span" sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Description:</Typography> {item.description}
                    </ListItemText>
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText>
                    <Typography component="span" sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Type:</Typography> {item.type}
                  </ListItemText>
                </ListItem>
                {item.max && (
                  <ListItem>
                    <ListItemText>
                      <Typography component="span" sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Max:</Typography> {item.max}
                    </ListItemText>
                  </ListItem>
                )}
                {item.options !== undefined && item.options.length > 0 && (
                  <ListItem>
                    <ListItemText>
                      <Typography component="span" sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Available Options:</Typography>
                      <List dense>
                        {item.options.map((item, i) => {
                          return (
                            <ListItem key={i} sx={{ py: 0 }}>
                              <ListItemText>
                                {item.property + ' (' + item.amount + ')'}
                              </ListItemText>
                            </ListItem>
                          )
                        })}
                      </List>
                    </ListItemText>
                  </ListItem>
                )}
              </List>

            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  );
};

export default Properties;