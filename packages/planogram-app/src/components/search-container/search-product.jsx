import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import { Grid } from '@material-ui/core';
import { PlanogramProduct } from '@planogram/design-system';
import { getOptimizedImage } from '../../@planogram/store/state/utility';

const SearchProduct = React.memo(({ searchData }) => {
  const dispatch = useDispatch();
  const selectedPosition = useSelector(
    ({ pog }) => pog.current.config.selectedPosition
  );
  const images = useSelector(({ pog }) => pog.images);

  let toolTip = selectedPosition.upc !== '__UNSELECTED__' ? false : true;

  const replaceHandler = (upc,bdc) => {
    if (selectedPosition.upc !== '__UNSELECTED__') {
      dispatch(
        actions.replacePlanogramPosition({
          ...selectedPosition,
          upc,
          bdc
        })
      );
    } else {
      console.log('no product selected to replace');
    }
  };

  const productSize = (sizeName)=>{
    return sizeName?sizeName:" "
  }

  return (
    <>
      {searchData.map((product, index) => (
        <Grid item xs={12} key={product.upc}>
          <PlanogramProduct
            key={index}
            imageUrl={
              getOptimizedImage(
                images,
                `${product.upc.toString().slice(-5)}.jpg`
              ).fluid.src
            }
            productUPC={product.upc}
            productBDC={product.bdc}
            category={product.category}
            description={product.description}
            productSize={productSize(product.sizename)}
            // productSize={product.size}
            replaceHandler={replaceHandler}
            toolTip={toolTip}
          />
        </Grid>
      ))}
    </>
  );
});

export default SearchProduct;
