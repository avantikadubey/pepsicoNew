/* eslint-disable operator-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import { useTheme } from '@material-ui/styles';
import { InfiniteScroll, InputControl } from '@planogram/design-system';
import {
  getOptimizedImage,
  subActivityType,
  CONFIG_TYPE,
  inventoryIndicatorColor
} from '../../@planogram/store/state/utility';
import { Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// import ButtonBase from '@material-ui/core/ButtonBase';
import Zoom from '@material-ui/core/Zoom';

const planogramViewConstants = {
  AVERAGE_MAX_HEIGHT: 18, // This is the product height
  AVERAGE_MIN_WIDTH: 3.75, // This is the product height
  AVERAGE_TOP_OFFSET: 9, // Product offset for all products when the average height is within range
  MARGIN_OFFSET: 5, // margin for each product,
  SIMULATOR_PERCENT: 0.4, // scale down for simulator
  EDIT_PERCENT: 0.8, // scale down for simulator,
  VERTICAL_HEIGHT: 1375,
  EDIT_SLICE: 6,
  SIMULATOR_SLICE: 12,
  BASE_PIXEL_MULTIPLIER: 6
};

const StyledImage = styled.img`
  border-left: ${(props) =>
    props.selected ? `3px solid rgba(0,124,193,0.93)` : 'none'};
  border-right: ${(props) =>
    props.selected ? `3px solid rgba(0,124,193,0.93)` : 'none'};
  border-top: ${(props) =>
    props.selected && props.type !== 'stackTop'
      ? `3px solid rgba(0,124,193,0.93)`
      : 'none'};
  border-bottom: ${(props) =>
    props.selected && props.type !== 'stackBottom'
      ? `3px solid rgba(0,124,193,0.93)`
      : 'none'};
  border-radius: 2px;
  -webkit-animation-name: flipInX;
  animation-name: flipInX;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;

  @-webkit-keyframes flipInX {
    0% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      -webkit-transition-timing-function: ease-in;
      transition-timing-function: ease-in;
      opacity: 0;
    }
    40% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      -webkit-transition-timing-function: ease-in;
      transition-timing-function: ease-in;
    }
    60% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
    }
    80% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    100% {
      -webkit-transform: perspective(400px);
      transform: perspective(400px);
    }
  }
  @keyframes flipInX {
    0% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      -webkit-transition-timing-function: ease-in;
      transition-timing-function: ease-in;
      opacity: 0;
    }
    40% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      -webkit-transition-timing-function: ease-in;
      transition-timing-function: ease-in;
    }
    60% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
    }
    80% {
      -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    100% {
      -webkit-transform: perspective(400px);
      transform: perspective(400px);
    }
  }

  @-webkit-keyframes fadeInLeftBig {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(-2000px, 0, 0);
      transform: translate3d(-2000px, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes fadeInLeftBig {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(-2000px, 0, 0);
      transform: translate3d(-2000px, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-moz-keyframes fadein {
    /* Firefox */
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadein {
    /* Safari and Chrome */
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-o-keyframes fadein {
    /* Opera */
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ProductIndicator = ({ indicator }) => {
  const theme = useTheme();

  return (
    <p
      style={{
        ...theme.typography.plano,
        background: `${indicator}`,
        height: '4px',
        width:'90%',
        marginLeft:'1px'
      }}
    >
      &nbsp;
    </p>
  );
};

const StyledProduct = styled.div`
  margin-top: ${(props) =>
    props.topScale * props.topZoomScale * props.fullViewPercent}px;
  margin-left: ${(props) =>
    props.x + planogramViewConstants.MARGIN_OFFSET * props.fullViewPercent}px;
  margin-right: ${(props) =>
    props.x + planogramViewConstants.MARGIN_OFFSET * props.fullViewPercent}px;
  position: absolute;
  width: ${(props) => props.w * props.scale * props.fullViewPercent}px;
  height: ${(props) => props.h * props.scale * props.fullViewPercent}px;
  top: ${(props) => props.y * props.scale * props.fullViewPercent}px;
  left: ${(props) => props.x * props.scale * props.fullViewPercent}px;
  margin-bottom: 0px;

  & img {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  & img:hover {
    cursor: ${(props) => (props.nonEditable ? 'not-allowed' : 'pointer')};
  }

  & p {
    text-transform: uppercase;
    font-family: sans-serif;
    font-size: 8px;
    font-weight: 600;
    text-align: center;
    padding: 0px;
    margin: -3px;
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const Product = ({
  id,
  segId,
  fixtureId,
  image,
  bdc,
  X,
  Y,
  x,
  y,
  w,
  h,
  offset,
  stackItem,
  prodWidth,
  units,
  availableQty,
  yFacings,
  selected,
  thumbNail
}) => {
  const [productUnits, setProductUnits] = useState(units);
  const [productAvailablityQty, setProductAvailablityQty] = useState(
    availableQty
  );

  const theme = useTheme();
  const currentMinWidth = useSelector(
    ({ pog }) => pog.current.planogram.minPosWidth
  );
  const currentMaxHeight = useSelector(
    ({ pog }) => pog.current.planogram.maxPosHeight
  );
  const zoom = useSelector(({ pog }) => pog.current.zoom);
  const currentSubActivityType = useSelector(
    ({ pog }) => pog.current.subActivity
  );

  const selectedDate = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.selectedDate
  );

  const matchedProduct = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.totalInventory
  );

  const matchedBackstockProduct = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.viewSimulationData.storeOutput
  );
  const serviceConfigType = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.serviceConfigName
  );
  const currentIndicator = matchedProduct.inventoryIndicator.find(
    (product) => product.bdc === bdc
  );
  
  const availableQuantity = matchedProduct.availableQuantity;
  const totalHoldingPowerBDC = matchedProduct.totalHoldingPowerBDC;
  const matchedBDCs = availableQuantity.find((product) => product.bdc === bdc);
  // console.log('currentIndicator.length', currentIndicator.length);
  let indicatorColor = null;
  let backStockIndicatorColor = null;
  let backStockQty = 0;
  let availableQnt = 0;
  if(currentSubActivityType === subActivityType.SUCCESS_SIMULATION ){

    const currentBackstockIndicator = matchedBackstockProduct.find(
      (product) => product.bdc === bdc && product.simulationDate === selectedDate
    );

 // console.log('currentBackstockIndicator', currentBackstockIndicator);
    if (currentBackstockIndicator && serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
      if (currentBackstockIndicator.backStockBegin === 0) {
        backStockIndicatorColor = inventoryIndicatorColor.PURPLE;
      }
      backStockQty = currentBackstockIndicator.backStockBegin;
      availableQnt = parseInt(currentBackstockIndicator.displayQtyBeforeRepService) + parseInt(currentBackstockIndicator.backStockBegin) ;
    }
    if (currentBackstockIndicator && (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES || serviceConfigType === CONFIG_TYPE.AFTER_SALES)) {
      if (currentBackstockIndicator.backStockAfterRepService === 0) {
        backStockIndicatorColor = inventoryIndicatorColor.PURPLE;
      }
      backStockQty = currentBackstockIndicator.backStockAfterRepService;
     
    }
    if(currentBackstockIndicator && (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES)){
      availableQnt = parseInt(currentBackstockIndicator.displayQtyAfterRepService) + parseInt(currentBackstockIndicator.backStockAfterRepService) ;
    }
    if(currentBackstockIndicator && serviceConfigType === CONFIG_TYPE.AFTER_SALES){
      availableQnt = parseInt(currentBackstockIndicator.displayQtyAfterSales) + parseInt(currentBackstockIndicator.backStockAfterRepService) ;
    }
}
  if (currentIndicator && serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
    // console.log('currentIndicator', currentIndicator)
    if (currentIndicator.inventoryFlagBeforeDelivery === 0) {
      indicatorColor = inventoryIndicatorColor.NONE;
    } else if (currentIndicator.inventoryFlagBeforeDelivery === 1) {
      indicatorColor = inventoryIndicatorColor.YELLOW;
    } else if (currentIndicator.inventoryFlagBeforeDelivery === 2) {
      indicatorColor = inventoryIndicatorColor.RED;
    }
  }

  if (currentIndicator && serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
    // console.log('currentIndicator', currentIndicator)
    if (currentIndicator.inventoryFlagAfterDelivery === 0) {
      indicatorColor = inventoryIndicatorColor.NONE;
    } else if (currentIndicator.inventoryFlagAfterDelivery === 1) {
      indicatorColor = inventoryIndicatorColor.YELLOW;
    } else if (currentIndicator.inventoryFlagAfterDelivery === 2) {
      indicatorColor = inventoryIndicatorColor.RED;
    }
  }
  
  if (currentIndicator && serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
    // console.log('currentIndicator', currentIndicator)
    if (currentIndicator.inventoryFlagAfterSales === 0) {
      indicatorColor = inventoryIndicatorColor.NONE;
    } else if (currentIndicator.inventoryFlagAfterSales === 1) {
      indicatorColor = inventoryIndicatorColor.YELLOW;
    } else if (currentIndicator.inventoryFlagAfterSales === 2) {
      indicatorColor = inventoryIndicatorColor.RED;
    }
  }

  const displayAvailableQuantity = (currentPosition) => {
    const qty = availableQuantity.find(
      (item) => item.bdc === currentPosition.bdc
    );
    if (matchedBDCs && serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
      return qty.displayQtyBeforeRepService;
    }
    if (matchedBDCs && serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
      return qty.displayQtyAfterRepService;
    }
    if (matchedBDCs && serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
      return qty.displayQtyAfterSales;
    }
  };
  const displayTotalHoldingPower = (currentPosition) => {
    const qty = totalHoldingPowerBDC.find(
      (item) => item.bdc === currentPosition.bdc
    );
    return typeof qty !== 'undefined' ? qty.holdingPower : 0;
  };
  const displayTotalHoldingPowerCount = (currentPosition) => {
    const qty = totalHoldingPowerBDC.find(
      (item) => item.bdc === currentPosition.bdc
    );
    return typeof qty !== 'undefined' ? qty.holdingPowerCount : 0;
  };
  
  //console.log("Indicator@#!#",indicatorColor)

  const dispatch = useDispatch();
  let scale = thumbNail ? 1 : planogramViewConstants.BASE_PIXEL_MULTIPLIER;
  // adjust the product display width scale based on
  // an average minimum width
  if (currentMinWidth < planogramViewConstants.AVERAGE_MIN_WIDTH) {
    scale += planogramViewConstants.AVERAGE_MIN_WIDTH - currentMinWidth + 3;
  }

  // adjust the product top offset margin based on
  // an average maximum height
  let topZoomScale = planogramViewConstants.AVERAGE_TOP_OFFSET;
  // console.log(`currentMaxHeight = ${currentMaxHeight}, AVERAGE_MAX_HEIGHT = ${AVERAGE_MAX_HEIGHT}, AVERAGE_MAX_HEIGHT - currentMaxHeight = ${AVERAGE_MAX_HEIGHT - currentMaxHeight}`)
  // Pos max height is more than average height
  if (currentMaxHeight > planogramViewConstants.AVERAGE_MAX_HEIGHT) {
    topZoomScale +=
      currentMaxHeight - planogramViewConstants.AVERAGE_MAX_HEIGHT;
  }

  // pos Max product height is less than the average height
  // by more than the average top offset
  // If the average max height vs pos max height difference is greater than
  // the average top offset then we need to adjust the top offset by the
  // difference
  if (
    planogramViewConstants.AVERAGE_MAX_HEIGHT - currentMaxHeight >
    planogramViewConstants.AVERAGE_TOP_OFFSET
  ) {
    topZoomScale +=
      planogramViewConstants.AVERAGE_MAX_HEIGHT - currentMaxHeight;
  }

  const currentPosition = {
    segId,
    Y,
    X,
    bdc,
    upc: id,
    fixtureId,
    units,
    prodWidth,
    availableQty
  };
  const isNonFLNA = (id) => {
    return  !id.startsWith('0028400');
  };

  const handleSelect = (selected, image) => {
    //  setClose(true);
    if (currentSubActivityType === subActivityType.EDIT_CONFIGURATION) {
      if (isNonFLNA(currentPosition.upc)) {
        return;
      }
      if (!selected) {
        dispatch(actions.setSelectedPlanogramPosition(currentPosition));
      } else {
        dispatch(actions.unSelectPlanogramPosition());
      }
    }
  };

  const handleIncrement = (type, value) => {
    if (type === 'units' && productUnits < 99) {
      setProductUnits(productUnits + 1);
      dispatch(
        actions.updatePlanogramPositionUnits({
          X,
          Y,
          units: productUnits + 1
        })
      );
    }

    if (type === 'avlQty' && productAvailablityQty < 99) {
      setProductAvailablityQty(productAvailablityQty + 1);
      dispatch(
        actions.updatePlanogramPositionAvailableQty({
          X,
          Y,
          availableQty: productAvailablityQty + 1
        })
      );
    }
  };

  const handleDecrement = (type, value) => {
    if (type === 'units' && productUnits > 0) {
      setProductUnits(productUnits - 1);
      dispatch(
        actions.updatePlanogramPositionUnits({
          X,
          Y,
          units: productUnits - 1
        })
      );
    }

    if (type === 'avlQty' && productAvailablityQty > 0) {
      setProductAvailablityQty(productAvailablityQty - 1);
      dispatch(
        actions.updatePlanogramPositionAvailableQty({
          X,
          Y,
          availableQty: productAvailablityQty - 1
        })
      );
    }
  };

  let topScale = stackItem ? Math.abs(y - offset) : y;
  let displayImage = image;
  const nonEditable = isNonFLNA(id);
  if (nonEditable) {
    displayImage = '/non-flna.svg';
  }

  const searchProducts = useSelector(({ pog }) => pog.products);
  let productDetails = searchProducts.find(
    (item) => item.upc === currentPosition.upc
  );

  let toolTipTittle = ' ';
  if (productDetails !== undefined && productDetails !== null) {
    toolTipTittle = `${productDetails.category ? productDetails.category : ' '} 
      - ${productDetails.description ? productDetails.description : ' '} ${
      productDetails.sizename ? '('+productDetails.sizename+')' : ' '
    }`;
  }

  const toolTipHtml = (
    <div style={{width: '240px', height: 'auto'}}>
      <div style={{width: '100%', textAlign: 'center', display: 'block',marginBottom: '10px'}}>
        <Typography variant="h5" component="h5">
          {toolTipTittle}
        </Typography>
      </div>

      <div style={{textAlign: 'center', alignSelf: 'center',display: 'flex'}}>
        <div style={{marginRight: '20px',maxWidth: '100px',width: '100%',textAlign: 'center',display: 'block',height: '80px'}}>
          <img
            src={displayImage}
            alt={displayImage}
            style={{
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        </div>
        <div style={{maxWidth: '120px',textAlign: 'left',display: 'block'}}>
          <Typography variant="h6" component="h6">
            UPC: <span>{currentPosition.upc}</span>
          </Typography>
          {currentPosition.bdc ? (
            <Typography variant="h6" component="h6">
              BDC: <span>{currentPosition.bdc}</span>
            </Typography>
          ) : (
            ''
          )}
          {currentSubActivityType === subActivityType.EDIT_CONFIGURATION && (
            <Typography variant="h6" component="h6">
              AvailableQty: <span>{productAvailablityQty}/{productUnits}</span>
            </Typography>
          )} 
          {/* <Typography variant="h6" component="h6">
              Available Qty:{' '}
              <span>{`${currentPosition.availableQty}/10`}</span>
            {currentPosition.units}
            </Typography> */}
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION && currentPosition.upc.startsWith('0028400') && (
            <Typography variant="h6" component="h6">
                AvailableQty: <span>{availableQnt}</span>
            </Typography>
          )}  
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION && currentPosition.upc.startsWith('0028400') && (
            <Typography variant="h6" component="h6">
              Display Qty:{' '}
              <span>{`${displayAvailableQuantity(currentPosition)}/${displayTotalHoldingPower(currentPosition)}`}</span>
            </Typography>
          )}
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION && currentPosition.upc.startsWith('0028400') && (
            <Typography variant="h6" component="h6">
              Facing Count :{' '}
              <span>{`${displayTotalHoldingPowerCount(currentPosition)}`}</span>
            </Typography>
          )}
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION && currentPosition.upc.startsWith('0028400') && (
            <Typography variant="h6" component="h6">
              BackStock :{' '}
              <span>{backStockQty}</span>
            </Typography>
          )}
        </div>
      </div>
    </div>
  );

  const renderProduct = (yFacings, x, y, w, h, scale, topScale, indicator) => {
    let products = [];

    for (let i = 0; i < yFacings; i += 1) {
      let top = y + i * h;
      const type =
        i === 0 && yFacings === 1
          ? 'all'
          : yFacings > 1 && i === yFacings - 1
          ? 'stackTop'
          : 'stackBottom';
      const fullViewPercent =
        currentSubActivityType === subActivityType.EDIT_CONFIGURATION
          ? planogramViewConstants.EDIT_PERCENT
          : zoom;
      const product = (
        <StyledProduct
          x={x}
          y={top}
          w={w}
          h={h}
          scale={scale}
          topScale={topScale}
          topZoomScale={topZoomScale}
          nonEditable={isNonFLNA(id)}
          fullViewPercent={fullViewPercent}
          key={`${id}-${x}-${y}-${i}`}
        >
          <div style={{marginBottom:'4px'}}>
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION &&
            i === yFacings - 1 &&
            backStockIndicatorColor && <ProductIndicator indicator={backStockIndicatorColor} />}
          </div>
          <HtmlTooltip
            title={toolTipHtml}
            TransitionComponent={Zoom}
            placement="right"
          >
            <StyledImage
              src={displayImage}
              alt={displayImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'pog/00000.jpg';
              }}
              loading="lazy"
              selected={selected}
              type={type}
              onClick={() => handleSelect(selected, image)}
            />
          </HtmlTooltip>
          {currentSubActivityType === subActivityType.EDIT_CONFIGURATION && (
            <div>
              {/* {i === yFacings - 1 && !selected && (
                <p style={{ ...theme.typography.plano }}>
                  {productUnits}/{productAvailablityQty}
                </p>
              )} */}
              {i === yFacings - 1 && selected && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 9999,
                    verticalAlign: 'middle',
                    position: 'absolute',
                    background: '#fff',
                    borderRadius: '5px',
                    padding: '5px',
                    boxShadow: '5px 5px 5px 1px rgba(0,0,0,0.54)'
                  }}
                >
                  <InputControl
                    data={productUnits}
                    handleIncrement={(val) => handleIncrement('units', val)}
                    handleDecrement={(val) => handleDecrement('units', val)}
                    color={theme.palette.secondary.main}
                  />

                  <InputControl
                    data={productAvailablityQty}
                    handleIncrement={(val) => handleIncrement('avlQty', val)}
                    handleDecrement={(val) => handleDecrement('avlQty', val)}
                    color={theme.palette.common.red}
                  />
                </div>
              )}
            </div>
          )}
          {currentSubActivityType === subActivityType.SUCCESS_SIMULATION &&
            i === yFacings - 1 &&
            indicator && <ProductIndicator indicator={indicator} />}
        </StyledProduct>
      );

      products.push(product);
    }
    return <div>{products}</div>;
  };
  return (
    <div>
      {renderProduct(yFacings, x, y, w, h, scale, topScale, indicatorColor)}
    </div>
  );
};

Product.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  thumbNail: PropTypes.bool
};

Product.defaultProps = {
  thumbNail: false
};

const Position = React.memo(({ id, segId, fixtureId, layout }) => {
  const selectedPosition = useSelector(
    ({ pog }) => pog.current.config.selectedPosition
  );

  const images = useSelector(({ pog }) => pog.images);
  const replaceList = useSelector(({ pog }) => pog.current.config.replaceList);
  const selected =
    selectedPosition.Y === layout.Y && selectedPosition.X === layout.X;
  const replaceImage = replaceList.find(
    (item) => item.X === layout.X && item.Y === layout.Y
  );

  // For non Pepsico products set the product image to 00000
  let imageUrl = id.startsWith('0028400')
    ? getOptimizedImage(images, `${id.toString().slice(-5)}.jpg`).fluid.src
    : getOptimizedImage(images, `00000.jpg`).fluid.src;

  let upc = id;
  if (typeof replaceImage !== 'undefined') {
    imageUrl = getOptimizedImage(
      images,
      `${replaceImage.upc.toString().slice(-5)}.jpg`
    ).fluid.src;
    upc = replaceImage.upc;
  }
  /* const imageUrl = replaceList !== '__UNSELECTED__'
      ? `pog/${replaceUPC.toString().slice(-5)}.jpg`
      : `pog/${id.toString().slice(-5)}.jpg`; */
  return (
    <Product
      {...layout}
      image={imageUrl}
      id={upc}
      fixtureId={fixtureId}
      segId={segId}
      selected={selected}
    />
  );
});

Position.propTypes = {
  id: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
  previousLayout: PropTypes.object
};

Position.defaultProps = {
  previousLayout: null
};

const Fixture = React.memo(({ id, segId, prodIds, layouts }) => {
  // console.log(id, prodIds, layouts)
  return (
    <>
      {prodIds.map((productId, index) => (
        <Position
          id={productId}
          fixtureId={id}
          segId={segId}
          key={`${id}-${productId}-${index}`}
          layout={layouts[index]}
        />
      ))}
    </>
  );
});

Fixture.propTypes = {
  id: PropTypes.string.isRequired,
  prodIds: PropTypes.array.isRequired,
  layouts: PropTypes.array.isRequired
};

export const SegmentContainer = styled.div(({ padding }) => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
  padding,
  position: 'relative'
}));

const Segment = React.memo(({ id, fixtures }) => {
  //console.log('fixtures', fixtures);
  return (
    <SegmentContainer>
      {fixtures.map((item) =>
        Object.entries(item).map((entry) => {
          const fixtureId = entry[0];
          const fixture = entry[1];
          return (
            <Fixture
              id={fixtureId}
              {...fixture}
              key={fixtureId}
              segId={id}
            ></Fixture>
          );
        })
      )}
    </SegmentContainer>
  );
});

Segment.propTypes = {
  fixtures: PropTypes.array.isRequired
};

export const Container = styled.div(({ padding }) => ({
  height: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  margin: 'auto',
  padding
}));

class PlanogramContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      segments: props.data.segments,
      maxHeight: props.data.maxHeight,
      items: props.simulationView
        ? props.data.segments.slice(0, planogramViewConstants.SIMULATOR_SLICE)
        : props.data.segments.slice(0, planogramViewConstants.EDIT_SLICE),
      currentSlice: props.simulationView
        ? planogramViewConstants.SIMULATOR_SLICE
        : planogramViewConstants.EDIT_SLICE,
      loading: false
    };
  }

  componentDidMount() {}

  handleScrollLeft = () => {};

  handleScrollRight = () => {
    const { currentSlice, segments } = this.state;
    if (currentSlice < segments.length) {
      this.setState({ loading: true });
      let nextSlice =
        currentSlice + planogramViewConstants < segments.length
          ? currentSlice + planogramViewConstants.EDIT_SLICE + 1
          : segments.length;
      if (this.props.simulationView) {
        nextSlice =
          currentSlice + planogramViewConstants.SIMULATOR_SLICE + 1 <
          segments.length
            ? currentSlice + planogramViewConstants.SIMULATOR_SLICE + 1
            : segments.length;
      }
      const newItems = segments.slice(0, nextSlice);
      setTimeout(() => {
        this.setState({
          items: newItems,
          currentSlice: nextSlice,
          loading: false
        });
      }, 600);
    }
  };

  handleOnScroll = (position, previousPosition) => {
    //  const diffScroll = position - previousPosition;
    //   const direction = diffScroll > 0 ? 'right' : 'left';
    //  console.log(`Scroll ${direction} to ${position}`);
  };

  render() {
    const { items, loading } = this.state;
    const { classes, padding } = this.props;
    // console.log('render', items);
    return (
      <div
        className={classes.root}
        style={{
          height: `${this.props.simulationView ? `88vh` : `74vh`}`
        }}
      >
        {loading && (
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
          onReachLeft={this.handleScrollLeft}
          onReachRight={this.handleScrollRight}
          onScroll={this.handleOnScroll}
          className={classes.root}
          horizontal
        >
          <Container padding={padding}>
            {items.map((segment) =>
              Object.entries(segment).map((entry) => (
                <Segment {...entry[1]} key={entry[0]} />
              ))
            )}
          </Container>
        </InfiniteScroll>
      </div>
    );
  }
}

PlanogramContainer.propTypes = {
  padding: PropTypes.string,
  thumbNail: PropTypes.bool,
  data: PropTypes.object,
  simulationView: PropTypes.bool
};

PlanogramContainer.defaultProps = {
  simulationView: false,
  thumbNail: false,
  padding: '1px',
  data: { segments: [] }
};

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 20,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    // '& img': {
    //   maxWidth: '100%',
    //   backgroundColor: 'red',
    // },
    '& h6': {
      fontSize: '12px',
      fontWeight: 'bold'
    },
    '& h5': {
      fontSize: '14px',
      fontWeight: 'bold'
    },
    '& span': {
      fontWeight: 300
    }
  }
}))(Tooltip);

export default withStyles((theme) => ({
  root: {
    display: 'flex',
    height: '74vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 25,
    border: `4px solid #bdbdbd`,
    padding: 10,
    backgroundColor: theme.palette.common.white
  },
  spinner: {
    zIndex: 100000
  },
  progress: {
    zIndex: 9999,
    verticalAlign: 'middle',
    position: 'absolute',
    background: '#fff',
    borderRadius: '5px',
    padding: '5px',
    opacity: 0.75
  }
}))(PlanogramContainer);
