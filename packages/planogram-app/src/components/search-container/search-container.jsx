import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { InfiniteScroll } from '@planogram/design-system';
import SearchProduct from './search-product';
import { isLoadingForSearchProduct } from '../../@planogram/store/state/utility';
import { css } from '@emotion/core';
// import * as _ from 'lodash';

export const scrollStyles = (whiteSpace) => css`
  border-radius: 25px;
  border: 4px solid #bdbdbd;
  height: 64.5vh;
  border-top: 2px solid #bdbdbd;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  text-align: center;
  scrollbar-width: thin;
  background: #ffffff;
  white-space: ${whiteSpace};
  overflow: hidden;
`;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    searchContainer: {
      height: '61vh',
      position: 'relative',
      paddingTop: '5px',
      paddingRight: '5px',
    },
    searchSection: {
      borderRadius: 25,
      border: `4px solid #bdbdbd`,
      height: '66vh',
      overflow: 'auto',
      textAlign: 'center',
      borderTop: 'none',
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
      backgroundColor: theme.palette.common.white
    },
    icon: {
      padding: '10px',
      fontSize: '40px',
      color: theme.palette.primary.main
    },
    inputAdor: {
      border: `4px solid #bdbdbd`,
      paddingRight: '0px',
      marginTop: '0px',
      borderRadius: 25,
      marginBottom: '0px',
      backgroundColor: theme.palette.common.white,
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      borderBottom: '0px',
      padding: 0
    },
    errorMessage: {
      colorr: theme.palette.error.dark,
      paddingTop: '4vh'
    },
    progress: {
      zIndex: 9999,
      verticalAlign: 'middle',
      position: 'absolute',
      background: '#fff',
      borderRadius: '5px',
      padding: '5px',
      opacity: 0.75,
      left: '0',
      right: '0',
      top: '50%'
    },
    spinner: {
      zIndex: 100000
    },
    mainSpinner: {
      zIndex: 100000,
      padding: '5px'
    }
  })
);

const SearchContainer = React.memo(({ productsForSearch }) => {
  //console.log("searchData from edit page 2 >>", productsForSearch);
  const classes = useStyles();
  let [productData, setProductData] = useState(productsForSearch);
  let [items, setItems] = useState([]);
  let [filterText, setFilterText] = useState('');
  let [filteredList, setFilteredList] = useState([]);
  let [currentSlice, setCurrentSlice] = useState(0);
  // loading List is for infinite scroll and filter updates
  let [loadingList, setLoadingList] = useState(false);
  const loading = useSelector(({ pog }) => pog.loading);
  //  const success = useSelector(({ pog }) => pog.success);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const currentFilteredProducts = useSelector(
    ({ pog }) => pog.current.config.filteredProducts
  );

  useEffect(() => {
    setLoadingList(true);
    setProductData(productsForSearch);
    setCurrentSlice(0);
    // There is a filter applied
    if (filterText.length > 1) {
      // If the products list has changed
      // Get the filter text and again filter the list
      // apply the sample to the search list
      const newFilteredList = filterProductsByText(filterText);
      setFilteredList(newFilteredList);
      setItems(newFilteredList.slice(0, 50));
      setCurrentSlice(5);
      setLoadingList(false);
    } else {
      setItems(productsForSearch.slice(0, 50));
      setFilteredList([]);
      setCurrentSlice(5);
      setLoadingList(false);
    }
  }, [productsForSearch]);

  const setScrollItems = (scrollItems) => {
    if (currentSlice < scrollItems.length) {
      setLoadingList(true);
      const nextSlice =
        currentSlice + 50 < scrollItems.length
          ? currentSlice + 50
          : scrollItems.length;
      const newItems = scrollItems.slice(0, nextSlice);
      setTimeout(() => {
        setItems(newItems);
        setCurrentSlice(nextSlice);
        setLoadingList(false);
      }, 600);
    }
  };

  const handleScrollBottom = () => {
    // If there is a filtering entry
    if (filteredList.length > 0) {
      setScrollItems(filteredList);
    } else {
      setScrollItems(productData);
    }
  };

  const filterProductsByText = (item) => {
    let productList = [...productsForSearch];
    let newProductList = [];
    let lastIndex = null;
    // input search value is > 2 characters
    if (item.length > 1) {
      productList.map((obj, index) => {
        for (var key in obj) {
          if (
            key === 'category' ||
            key === 'upc' ||
            key === 'brand' ||
            key === 'sizename'
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
        return null;
      });
    }
    return newProductList;
  };

  const searchHandler = (event) => {
    let productList = [...productsForSearch];
    let newProductList = [];
    setFilterText(event.target.value);
    let item = event.target.value.toLowerCase();
    let lastIndex = null;

    // input search value is > 2 characters
    if (item.length > 1) {
      productList.map((obj, index) => {
        for (var key in obj) {
          if (
            key === 'category' ||
            key === 'upc' ||
            key === 'brand' ||
            key === 'sizename'
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
        return null;
      });
      setFilteredList(newProductList);
      setItems(newProductList);
    } else {
      setFilteredList([]);
      setItems(productList);
    }
  };
  // if the product list is empty and the filtered list is empty , this means
  // the products are still being loaded
  let stillLoadingProducts;
  if (currentFilteredProducts && productsForSearch) {
    stillLoadingProducts =
      productsForSearch.length === 0 && currentFilteredProducts.length === 0;
  }

  return (
    <>
      <Grid item xs={12} container spacing={0}>
        <TextField
          className={classes.inputAdor}
          label="Search Product"
          margin="normal"
          variant="filled"
          value={filterText}
          onChange={searchHandler}
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
      {/* <Grid item xs={12} >{productData.length}</Grid> */}
      <Grid item xs={12} css={scrollStyles(true)}>
        <div className={classes.searchContainer}>
          {loadingList && (
            <div className={classes.progress}>
              <CircularProgress
                className={classes.spinner}
                color="secondary"
                size={50}
                thickness={5}
              />
            </div>
          )}
          <InfiniteScroll
            onReachBottom={handleScrollBottom}
            className={classes.searchContainer}
          >
            {isLoadingForSearchProduct(loading, currentLoadingType) && (
              <CircularProgress
                color="secondary"
                className={classes.spinner}
                size={50}
              />
            )}
            {stillLoadingProducts && (
              <CircularProgress
                color="primary"
                className={classes.mainSpinner}
                size={50}
              />
            )}
            {!stillLoadingProducts && items.length > 0 && (
              <SearchProduct searchData={items} />
            )}
            {!stillLoadingProducts && items.length === 0 && (
              <Grid item xs={12} className={classes.errorMessage}>
                <Typography variant="body1">No Products Found</Typography>
              </Grid>
            )}
          </InfiniteScroll>
        </div>
      </Grid>
    </>
  );
});

export default SearchContainer;
