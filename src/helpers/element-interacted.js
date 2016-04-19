export function elementInteracted({ sourceName, interaction, map }, e) {
  const features = map.queryRenderedFeatures(e.point, { layers: [sourceName] });

  if (!features.length) {
      return false;
  }

  const feature = features[0];

  interaction(feature, map);

  return true;
}
