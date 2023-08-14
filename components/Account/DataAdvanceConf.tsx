import { ReactNode, useState } from "react";
import {
  Divider,
  Button,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItem,
  CardHeader,
  Card,
  List,
  Grid,
} from "@mui/material";

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

interface Props {
  right: readonly string[];
  setRight: (value: readonly string[]) => void;
}

const DataAdvanceConf = ({ right, setRight }: Props) => {
  const [checked, setChecked] = useState<readonly string[]>([]);
  const [left, setLeft] = useState<readonly string[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: ReactNode, items: readonly string[]) => (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "rgba(26, 53, 80, 0.897)",
      }}
    >
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items seleccionado(s)",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} seleccionado(s)`}
      />
      <Divider />
      <List
        sx={{
          width: "100%",
          height: 230,
          bgcolor: "#112233",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItemButton>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item sx={{ mr: 2, width: "35%", maxWidth: 300 }}>
        {customList("Excluido(s)", left)}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move seleccionado(s) right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move seleccionado(s) left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item sx={{ ml: 2, width: "35%", maxWidth: 300 }}>
        {customList("Incluido(s)", right)}
      </Grid>
    </Grid>
  );
};

export { DataAdvanceConf };
