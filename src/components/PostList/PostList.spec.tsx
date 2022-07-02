import React from 'react';
import { render, screen } from '@testing-library/react';

import { PostList } from './PostList'

describe('<PostList />', () => {
  it('renders', () => {
    render(<PostList>test</PostList>)
  })
})