import type { Options } from '../types/types';
import Select from './Select';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

type SortByProps = {
  options: Options[];
};

export default function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set('sortBy', e.target.value);
    setSearchParams(searchParams);
  }

  return <Select options={options} onChange={handleChange} type="white" value={sortBy} />;
}
