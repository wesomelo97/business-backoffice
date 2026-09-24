const STORAGE_PREFIX = "business-backoffice";

function buildKey(projectId, resource) {
  return `${STORAGE_PREFIX}:${projectId}:${resource}`;
}

export function getStoredData(projectId, resource, fallbackData) {
  const key = buildKey(projectId, resource);

  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallbackData));
      return fallbackData;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error(`Erro ao carregar ${resource}:`, error);
    return fallbackData;
  }
}

export function saveStoredData(projectId, resource, data) {
  const key = buildKey(projectId, resource);

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${resource}:`, error);
  }
}

export function removeStoredData(projectId, resource) {
  const key = buildKey(projectId, resource);
  localStorage.removeItem(key);
}