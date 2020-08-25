import React, { Fragment, useEffect, useState } from 'react';
import { Grid, Button, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as actions from '../../@planogram/store/state/actions';
import { activityType, isSuccessForUpdateProductForBackStock, isLoadingForGetProductForBackStock, getOptimizedImage, isSuccessForGetProductForBackStock } from '../../@planogram/store/state/utility';
import { ReactTable } from '@planogram/design-system';
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'


function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      isNumericString
      allowNegative={false}
      format="###"
    />
  )
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

const BackStockContainer = React.memo(({ classes }) => {
  const loading = useSelector(({ pog }) => pog.loading);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const currentConfig = useSelector(({ pog }) => pog.current.config)
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  let backStockProducts = useSelector(({ pog }) => pog.backStockProducts);
  const backStockSearchResult = useSelector(({ pog }) => pog.backStockSearchResult);
  const success = useSelector(({ pog }) => pog.success);
  const updatedBackStockProducts = useSelector(({ pog }) => pog.updatedBackStockProducts);
  const images = useSelector(({ pog }) => pog.images);
  let [searchItems, setSearchItems] = useState([]);
  let [searchActive, setSearchActive] = useState(false);
  let [filterText, setFilterText] = useState('');
  let [filteredList, setFilteredList] = useState([]);
  let [resetText, setResetText] = useState('');
  let [resetTextLoading, setResetTextLoading] = useState(true);
  if (currentActivity === activityType.BACK_STOCK) {
    console.log('BackStock Rendered');
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccessForUpdateProductForBackStock(success, currentLoadingType)) {
      dispatch(actions.clearProductBackStockQuantity());
    } 
  }, [success, currentLoadingType]);

  useEffect(() => {
    if(isSuccessForGetProductForBackStock(success, currentLoadingType)){
      backStockProducts = backStockProducts;
    }
  });

  let backStock = [];
  const list = Object.entries(
    _.groupBy(backStockProducts, (product)=>`${product.title} - ${product.description} - ${product.sizename}`)
  ).map((entry) => {
    backStock.push({
      title: entry[0],
      id:entry[1][0].id,
      upc:entry[1][0].upc,
      bdc:entry[1][0].bdc,
      csId:entry[1][0].csId,
      backstockQty:parseInt(entry[1][0].backstockQty)
    });
    // return true;
  });

  const onChangeHandler = (event, rowData) => {
    console.log('event.target.value', event.target.value);
    // if( event.target.value > 0 ){
      const data = {
        id: rowData.id,
        upc:rowData.upc,
        bdc: rowData.bdc,
        csId: rowData.csId,
        backstockQty: parseInt(event.target.value)
      }
      dispatch(actions.updateProductBackStockQuantity(data));
    // }
  }

  const updatebackStockHandler = () => {
    dispatch(actions.updateProductsForBackStock(updatedBackStockProducts));
  }

  const cancelUpdatedListHandler = () => {
    setFilteredList([]);
    setSearchItems([]);
    setFilterText('');
    setSearchActive(false);
    dispatch(actions.clearProductBackStockQuantity());
    dispatch(actions.loadProductsForBackStock(currentConfig.storeId));
  }

  const handleSearch = (event) => {
    let productList = [...backStock];
    let newProductList = [];
    setFilterText(event.target.value);
    let item = event.target.value.toLowerCase();
    let lastIndex = null;

    // input search value is > 3 characters

    if (item.length > 0) {
      productList.map((obj, index) => {
        for (var key in obj) {
          if (
            key === 'title' ||
            key === 'upc' ||
            key === 'bdc'
          ) {
            if (
              obj[key] &&
              obj[key]
                .toString()
                .toLowerCase()
                .indexOf(item) !== -1 &&
              index !== lastIndex
            ) {
              newProductList.push(obj);
              lastIndex = index;
            }
          }
        }
        console.log('newProductList', newProductList)
        return null;
      });
      setSearchActive(true);
      setFilteredList(newProductList);
      setSearchItems(newProductList);
      dispatch(actions.setBackSTockSearchResult(newProductList));
    } else {
      setSearchActive(false);
      setFilteredList([]);
      dispatch(actions.setBackSTockSearchResult([]));
    }
  }; 

  const displayImage = (data) => {
		let image = getOptimizedImage(images, `${data.toString().slice(-5)}.jpg`).fluid.src;
		const isNonFLNA = (image) => {
			return image.endsWith('00000.jpg');
		};
		const nonEditable = isNonFLNA(image);
    if (nonEditable) {
      image = '/non-flna.svg';
    }
    return image;
  }

  const resetBackStockQty = async() =>{
    if(resetText){
      setResetTextLoading(false);
      const data = searchActive ? searchItems : backStock;
      if(data){
        await data.forEach(element=>{
          dispatch(actions.updateProductBackStockQuantity({
            id: element.id,
            upc:element.upc,
            bdc: element.bdc,
            csId: element.csId,
            backstockQty: parseInt(resetText)
          }));
        });
      }
      setResetTextLoading(true);
    }
  };

  const resetInputBox = event => setResetText(event.target.value)
  

  return (
    <Fragment>
      {currentActivity === activityType.BACK_STOCK && (
        <Grid container>
          <Grid item sm={12} className={classes.searchArea}>
            <Grid item sm={3} md={3} lg={3}>
              <TextField
                className={classes.search}
                label="Search Product"
                margin="normal"
                variant="filled"
                value={filterText}
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <FontAwesomeIcon
                        icon={['fas', 'search']}
                        size="2x"
                        className={classes.icon}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }}
              />
            </Grid>
            <Grid item sm={2} md={3} lg={4}>
                {/*BLANK CONTAINER*/}
            </Grid>
            <Grid item sm={7} md={6} lg={5} className={classes.resetArea}>
              <Button color="primary" variant="contained"
                className={classes.resetBtn}
                onClick={resetBackStockQty} >Reset to default</Button>
            
              <TextField
                className={classes.resetInput}
                onChange={event => resetInputBox(event, 'numberformat')}
                label="Enter default Qty"
                variant="filled"
                margin="normal"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>          
          </Grid>
          {isLoadingForGetProductForBackStock(loading, currentLoadingType) ? (
            <Grid item sm={12}>
              <CircularProgress color="primary" size={50} />
            </Grid>
          ) : (
            <Fragment>
              <Grid item sm={12}>
                {!resetTextLoading && <CircularProgress className={classes.resetLoader} color="secondary" size={50} />}
                {resetTextLoading && <ReactTable 
                  rows={searchActive ? backStockSearchResult : backStock} 
                  onChangeHandler={onChangeHandler}
                  displayImage={displayImage}
                />}
              </Grid>
              <Grid item sm={12} className={classes.cta}>
                <Button color="primary" variant="contained" className={classes.btn} onClick={cancelUpdatedListHandler} disabled={!currentConfig.dirty}>Cancel</Button>
                <Button color="primary" variant="contained" className={classes.btn} onClick={updatebackStockHandler} disabled={!currentConfig.dirty}>Update</Button>
              </Grid>
            </Fragment>
          )}
        </Grid>
      )}
    </Fragment>
  );
});

export default withStyles((theme)=> ({
  cta: {
    textAlign: 'center',
    paddingTop: 20,
  },
  btn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 35px',
    height: 'auto',
    cursor: 'pointer',
    marginRight: '20px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
  },
  search: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',    
    borderColor: theme.palette.grey[500],
    '& .MuiFilledInput-adornedEnd input' :{
      padding: '20px 12px 5px',
    },
    '& svg.fa-search': {
      width: '20px', 
      height: '20px',
      '& path': {
        fill: theme.palette.grey[500]
      },
    },
  },
  searchArea: {
    // backgroundColor: theme.palette.grey[200],
    // borderBottom: '1px solid',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
  },
  resetBtn:{
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 25px',
    height: 'auto',
    cursor: 'pointer',
    marginLeft: '20px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
  },
  resetInput:{
    backgroundColor: theme.palette.common.white,
    border: '1px solid',    
    borderColor: theme.palette.grey[500],
    marginTop: '10px',
    '& input' :{
      padding: '20px 12px 5px',
    },
  },
  resetArea:{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  resetLoader:{
    display: 'block',
    margin: '0 auto'
  },
}))(BackStockContainer);
