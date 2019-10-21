import * as React from 'react';
import { withMap } from './context';
import { Map } from 'mapbox-gl';

interface ImageOptionsType {
  pixelRatio?: number;
  sdf?: boolean;
}

type ImageDataType =
  | HTMLImageElement
  | ArrayBufferView
  | { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
  | ImageData;

export interface Props {
  id: string;
  url?: string;
  data?: ImageDataType;
  options?: ImageOptionsType;
  onLoaded?: () => void;
  onError?: (error: Error) => void;
  map: Map;
}

class Image extends React.Component<Props> {
  public UNSAFE_componentWillMount() {
    this.loadImage(this.props);
  }

  public componentWillUnmount() {
    Image.removeImage(this.props);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { id } = this.props;

    if (nextProps.map !== this.props.map) {
      // Remove image from old map
      Image.removeImage(this.props);
    }

    if (nextProps.map && !nextProps.map.hasImage(id)) {
      // Add missing image to map
      this.loadImage(nextProps);
    }
  }

  public render() {
    return null;
  }

  private loadImage(props: Props) {
    const { map, id, url, data, options, onError } = props;

    if (data) {
      map.addImage(id, data, options);
      this.loaded();
    } else if (url) {
      map.loadImage(url, (error: Error | undefined, image: ImageDataType) => {
        if (error) {
          if (onError) {
            onError(error);
          }

          return;
        }
        map.addImage(id, image, options);
        this.loaded();
      });
    }
  }

  private static removeImage(props: Props) {
    const { id, map } = props;
    if (map && map.getStyle()) {
      map.removeImage(id);
    }
  }
  private loaded() {
    const { onLoaded } = this.props;
    if (onLoaded) {
      onLoaded();
    }
  }
}

export default withMap(Image);
