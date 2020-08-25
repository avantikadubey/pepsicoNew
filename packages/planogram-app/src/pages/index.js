import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { useDispatch } from 'react-redux';
import * as actions from '../@planogram/store/state/actions';
import AppLayout from '../components/app-layout/app-layout';

const IndexPage = ({ data }) => {
  const dispatch = useDispatch();
  const content = data.allImageSharp.edges.map(
    /**
     * @function
     * @param {object} obj
     * @param {object} obj.node
     * @returns {object}
     */
    ({ node }) => node
  );
 // console.log(content)
//  console.log(content.find(item => item.fluid.originalName === '00000.jpg'))
  dispatch(actions.setProductImages(content));
  return (
    <Fragment>
      <AppLayout />
    </Fragment>
  );
};
export const query = graphql`
  {
    allImageSharp {
      edges {
        node {
          fluid(maxWidth: 100) {
            sizes
            originalName
            originalImg
            src
          }
        }
      }
    }
  }
`;

export default IndexPage;
