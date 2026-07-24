export async function onRequestGet(context: any) {
  const data = await context.env.TRACKER_DATA.get('tracker');
  return new Response(data || '{}', {
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestPost(context: any) {
  const request = context.request;
  const data = await request.text();
  await context.env.TRACKER_DATA.put('tracker', data);
  return new Response('{"success": true}', {
    headers: { 'content-type': 'application/json' }
  });
}
