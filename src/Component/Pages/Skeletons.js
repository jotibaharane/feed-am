import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Card, CardContent, Paper } from "@mui/material";

function Skeletons(props) {
  return (
    <Paper elevation={3}>
      <Card sx={{ width: 700, maxHeight: "150vh" }}>
        <CardContent>
          <Skeleton width="40%" />
          <Skeleton variant="rectangular" width="100%" height={300} />
          <Skeleton width="40%" />
          <Skeleton width="50%" />
          <Skeleton />
        </CardContent>
      </Card>
    </Paper>
  );
}

export default Skeletons;
