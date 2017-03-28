import React, { Component } from 'react';
import style from './style.json';
import config from './config.json';
import places from './places.json';
import ReactMapboxGl, { Source, Layer } from "react-mapbox-gl";

const containerStyle = {
    height: '100vh',
    width: '100%'
};

const PLACES_SOURCE_ID = 'places';
let PLACES_SOURCE_OPTIONS = {
    type: 'geojson',
    data: places,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
};

const unclusterePointsProps = {
    id: 'unclustered-points',
    type: 'symbol',
    sourceId: PLACES_SOURCE_ID,
    layerOptions: {
        'filter': ['!has', 'point_count']
    },
    layout: {
        'icon-image': 'marker-15',
        'text-field': 'P',
        'text-size': 16,
        'text-pitch-alignment': 'viewport',
        'text-font': [
            'Arial Unicode MS Regular'
        ]
    },
    paint: {
        'text-color': '#FFFF00',
        'text-halo-color': '#FF2200',
        'text-halo-width': 2,
        'text-halo-blur': 1,
    }
};

const layerTypes = [
    [150, '#f28cb1'],
    [20, '#f1f075'],
    [0, '#51bbd6']
];

const clusterCountOpts = {
    id: 'cluster-count',
    type: 'symbol',
    sourceId: PLACES_SOURCE_ID,
    layout: {
        'text-field': '{point_count}',
        'text-font': [
            'DIN Offc Pro Medium',
            'Arial Unicode MS Bold'
        ],
        'text-size': 12
    }
};

export default class ClusterWithLayers extends Component {

    render() {
        let clusterLayers = layerTypes.map((layer, i) => {
            let layerProps = {
                key: 'cluster-' + i,
                id: 'cluster-' + i,
                type: 'circle',
                sourceId: PLACES_SOURCE_ID,
                paint: {
                    'circle-color': layer[1],
                    'circle-radius': 18
                },
                layout: {
                    visibility: 'visible'
                },
                layerOptions: {
                    filter: i === 0 ?
                        ['>=', 'point_count', layer[0]] :
                        ['all',
                            ['>=', 'point_count', layer[0]],
                            ['<', 'point_count', layerTypes[i - 1][0]]]
                }
            };
            return <Layer {...layerProps} />;
        });


        return (
            <ReactMapboxGl style={ style } zoom={ [4] } accessToken={ config.accessToken } containerStyle={ containerStyle }>
              <Source id={ PLACES_SOURCE_ID } geoJsonSource={ PLACES_SOURCE_OPTIONS } onSourceAdded={ (s) => {
                                                                                                          setTimeout(() => {
                                                                                                              s.setData(places)
                                                                                                          },100);
                                                                                                      
                                                                                                      } } />
              <Layer {...unclusterePointsProps} />
              { clusterLayers }
              <Layer {...clusterCountOpts} />
            </ReactMapboxGl>
            );
    }
}
